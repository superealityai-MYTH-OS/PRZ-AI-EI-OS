/**
 * Couchbase Database Adapter
 * Implements the DatabaseAdapter interface for Couchbase
 * 
 * Installation: npm install couchbase
 * Documentation: https://docs.couchbase.com/nodejs-sdk/current/hello-world/start-using-sdk.html
 */

import { DatabaseAdapter, DatabaseConfig } from './base';

export interface CouchbaseConfig extends DatabaseConfig {
  connectionString: string;
  username: string;
  password: string;
  bucketName: string;
  scopeName?: string;
  collectionName?: string;
}

/**
 * Couchbase adapter implementation
 * 
 * Example usage:
 * ```typescript
 * const adapter = new CouchbaseAdapter({
 *   connectionString: 'couchbase://localhost',
 *   username: 'Administrator',
 *   password: 'password',
 *   bucketName: 'myBucket'
 * });
 * 
 * await adapter.connect();
 * 
 * // Insert data
 * const id = await adapter.insertOne('users', { 
 *   name: 'John', 
 *   email: 'john@example.com' 
 * });
 * 
 * // Query data using N1QL
 * const users = await adapter.query('SELECT * FROM users WHERE name = $1', ['John']);
 * 
 * // Get by ID
 * const user = await adapter.findOne('users', { id: '123' });
 * 
 * await adapter.disconnect();
 * ```
 */
export class CouchbaseAdapter implements DatabaseAdapter {
  private config: CouchbaseConfig;
  private cluster: any = null;
  private bucket: any = null;
  private collection: any = null;

  constructor(config: CouchbaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring Couchbase as a hard dependency
      // @ts-ignore - Optional dependency
      const couchbase = await import('couchbase');
      
      this.cluster = await couchbase.connect(this.config.connectionString, {
        username: this.config.username,
        password: this.config.password,
      });

      this.bucket = this.cluster.bucket(this.config.bucketName);
      
      const scope = this.config.scopeName || '_default';
      const collectionName = this.config.collectionName || '_default';
      
      this.collection = this.bucket.scope(scope).collection(collectionName);
    } catch (error) {
      throw new Error(`Couchbase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.cluster) {
      await this.cluster.close();
      this.cluster = null;
      this.bucket = null;
      this.collection = null;
    }
  }

  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.collection) throw new Error('Not connected to Couchbase');
    
    const id = data.id || `${collection}::${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.collection.insert(id, data);
    
    return id;
  }

  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.collection) throw new Error('Not connected to Couchbase');
    
    const ids: string[] = [];
    
    for (const item of data) {
      const id = await this.insertOne(collection, item);
      ids.push(id);
    }
    
    return ids;
  }

  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.cluster) throw new Error('Not connected to Couchbase');
    
    // Build N1QL query
    const whereConditions = Object.keys(query)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    
    const n1qlQuery = whereConditions
      ? `SELECT META().id, * FROM \`${this.config.bucketName}\` WHERE ${whereConditions}`
      : `SELECT META().id, * FROM \`${this.config.bucketName}\``;
    
    const result = await this.cluster.query(n1qlQuery, {
      parameters: Object.values(query)
    });
    
    return result.rows.map((row: any) => {
      const { id, ...data } = row;
      return { id, ...data };
    });
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    if (!this.collection) throw new Error('Not connected to Couchbase');
    
    // If querying by id directly
    if (query.id) {
      try {
        const result = await this.collection.get(query.id);
        return { id: query.id, ...result.content };
      } catch (error: any) {
        if (error.name === 'DocumentNotFoundError') {
          return null;
        }
        throw error;
      }
    }
    
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.collection) throw new Error('Not connected to Couchbase');
    
    // If updating by id
    if (query.id) {
      try {
        const result = await this.collection.get(query.id);
        const updatedData = { ...result.content, ...update };
        await this.collection.replace(query.id, updatedData);
        return 1;
      } catch (error: any) {
        if (error.name === 'DocumentNotFoundError') {
          return 0;
        }
        throw error;
      }
    }
    
    // Update multiple documents via N1QL
    const whereConditions = Object.keys(query)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    
    const setClause = Object.keys(update)
      .map((key, index) => `${key} = $${index + 1 + Object.keys(query).length}`)
      .join(', ');
    
    const n1qlQuery = `UPDATE \`${this.config.bucketName}\` SET ${setClause} WHERE ${whereConditions}`;
    
    const result = await this.cluster.query(n1qlQuery, {
      parameters: [...Object.values(query), ...Object.values(update)]
    });
    
    return result.meta.metrics.mutationCount || 0;
  }

  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.collection) throw new Error('Not connected to Couchbase');
    
    // If deleting by id
    if (query.id) {
      try {
        await this.collection.remove(query.id);
        return 1;
      } catch (error: any) {
        if (error.name === 'DocumentNotFoundError') {
          return 0;
        }
        throw error;
      }
    }
    
    // Delete multiple documents via N1QL
    const whereConditions = Object.keys(query)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    
    const n1qlQuery = `DELETE FROM \`${this.config.bucketName}\` WHERE ${whereConditions}`;
    
    const result = await this.cluster.query(n1qlQuery, {
      parameters: Object.values(query)
    });
    
    return result.meta.metrics.mutationCount || 0;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.cluster) return false;
    
    try {
      await this.cluster.ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Couchbase-specific: Execute N1QL query
   * @param query N1QL query string
   * @param params Query parameters
   */
  async query(query: string, params: any[] = []): Promise<any[]> {
    if (!this.cluster) throw new Error('Not connected to Couchbase');
    
    const result = await this.cluster.query(query, { parameters: params });
    return result.rows;
  }

  /**
   * Couchbase-specific: Create a primary index
   * @param indexName Index name
   */
  async createPrimaryIndex(indexName?: string): Promise<void> {
    if (!this.cluster) throw new Error('Not connected to Couchbase');
    
    const indexNameClause = indexName ? `\`${indexName}\`` : '';
    const query = `CREATE PRIMARY INDEX ${indexNameClause} ON \`${this.config.bucketName}\``;
    
    await this.cluster.query(query);
  }

  /**
   * Couchbase-specific: Upsert a document (insert or update)
   * @param id Document ID
   * @param data Document data
   */
  async upsert(id: string, data: any): Promise<void> {
    if (!this.collection) throw new Error('Not connected to Couchbase');
    
    await this.collection.upsert(id, data);
  }
}
