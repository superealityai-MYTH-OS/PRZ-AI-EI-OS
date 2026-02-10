/**
 * MongoDB Database Adapter
 * Implements the DatabaseAdapter interface for MongoDB
 * 
 * Installation: npm install mongodb
 * Documentation: https://www.mongodb.com/docs/drivers/node/current/
 */

import { DatabaseAdapter, DatabaseConfig } from './base';

export interface MongoDBConfig extends DatabaseConfig {
  uri?: string;
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  authSource?: string;
  replicaSet?: string;
  ssl?: boolean;
  maxPoolSize?: number;
}

/**
 * MongoDB adapter implementation
 * 
 * Example usage:
 * ```typescript
 * const adapter = new MongoDBAdapter({
 *   host: 'localhost',
 *   port: 27017,
 *   database: 'mydb',
 *   username: 'user',
 *   password: 'pass'
 * });
 * 
 * await adapter.connect();
 * const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
 * const users = await adapter.find('users', { name: 'John' });
 * await adapter.disconnect();
 * ```
 */
export class MongoDBAdapter implements DatabaseAdapter {
  private config: MongoDBConfig;
  private client: any = null;
  private db: any = null;

  constructor(config: MongoDBConfig) {
    this.config = config;
  }

  /**
   * Builds MongoDB connection URI from config
   */
  private getConnectionUri(): string {
    if (this.config.uri) {
      return this.config.uri;
    }

    const { host = 'localhost', port = 27017, username, password, database, authSource = 'admin' } = this.config;
    
    if (username && password) {
      return `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`;
    }
    
    return `mongodb://${host}:${port}/${database}`;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring MongoDB as a hard dependency
      // @ts-ignore - Optional dependency
      const { MongoClient } = await import('mongodb');
      
      const uri = this.getConnectionUri();
      const options: any = {
        maxPoolSize: this.config.maxPoolSize || 10,
      };

      if (this.config.ssl) {
        options.tls = true;
      }

      this.client = new MongoClient(uri, options);
      await this.client.connect();
      this.db = this.client.db(this.config.database);
    } catch (error) {
      throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    const result = await this.db.collection(collection).insertOne(data);
    return result.insertedId.toString();
  }

  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    const result = await this.db.collection(collection).insertMany(data);
    return Object.values(result.insertedIds).map((id: any) => id.toString());
  }

  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    return await this.db.collection(collection).find(query).toArray();
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    return await this.db.collection(collection).findOne(query);
  }

  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    const result = await this.db.collection(collection).updateMany(query, { $set: update });
    return result.modifiedCount;
  }

  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    const result = await this.db.collection(collection).deleteMany(query);
    return result.deletedCount;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * MongoDB-specific: Create an index on a collection
   * @param collection Collection name
   * @param keys Index specification
   * @param options Index options
   */
  async createIndex(collection: string, keys: Record<string, 1 | -1>, options?: any): Promise<string> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    return await this.db.collection(collection).createIndex(keys, options);
  }

  /**
   * MongoDB-specific: Aggregate pipeline query
   * @param collection Collection name
   * @param pipeline Aggregation pipeline stages
   */
  async aggregate(collection: string, pipeline: any[]): Promise<any[]> {
    if (!this.db) throw new Error('Not connected to MongoDB');
    
    return await this.db.collection(collection).aggregate(pipeline).toArray();
  }
}
