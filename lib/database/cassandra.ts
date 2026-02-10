/**
 * Apache Cassandra Database Adapter
 * Implements the DatabaseAdapter interface for Cassandra
 * 
 * Installation: npm install cassandra-driver
 * Documentation: https://docs.datastax.com/en/developer/nodejs-driver/
 */

import { DatabaseAdapter, DatabaseConfig } from './base';

export interface CassandraConfig extends DatabaseConfig {
  contactPoints?: string[];
  localDataCenter: string;
  keyspace: string;
  username?: string;
  password?: string;
  port?: number;
  protocolOptions?: {
    port?: number;
  };
}

/**
 * Cassandra adapter implementation
 * Note: Cassandra requires table schemas to be created beforehand
 * 
 * Example usage:
 * ```typescript
 * const adapter = new CassandraAdapter({
 *   contactPoints: ['127.0.0.1'],
 *   localDataCenter: 'datacenter1',
 *   keyspace: 'mykeyspace',
 *   username: 'cassandra',
 *   password: 'cassandra'
 * });
 * 
 * await adapter.connect();
 * 
 * // First, create a table (do this once)
 * await adapter.executeQuery(`
 *   CREATE TABLE IF NOT EXISTS users (
 *     id UUID PRIMARY KEY,
 *     name TEXT,
 *     email TEXT
 *   )
 * `);
 * 
 * // Insert data
 * const id = await adapter.insertOne('users', { 
 *   id: 'uuid-here',
 *   name: 'John', 
 *   email: 'john@example.com' 
 * });
 * 
 * // Query data
 * const users = await adapter.find('users', { name: 'John' });
 * 
 * await adapter.disconnect();
 * ```
 */
export class CassandraAdapter implements DatabaseAdapter {
  private config: CassandraConfig;
  private client: any = null;

  constructor(config: CassandraConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring Cassandra as a hard dependency
      // @ts-ignore - Optional dependency
      const cassandra = await import('cassandra-driver');
      
      const authProvider = this.config.username && this.config.password
        ? new cassandra.auth.PlainTextAuthProvider(this.config.username, this.config.password)
        : undefined;

      this.client = new cassandra.Client({
        contactPoints: this.config.contactPoints || ['127.0.0.1'],
        localDataCenter: this.config.localDataCenter,
        keyspace: this.config.keyspace,
        authProvider,
        protocolOptions: this.config.protocolOptions || { port: this.config.port || 9042 }
      });

      await this.client.connect();
    } catch (error) {
      throw new Error(`Cassandra connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.shutdown();
      this.client = null;
    }
  }

  /**
   * Helper to generate UUID for Cassandra
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    const id = data.id || this.generateUUID();
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${collection} (${columns}) VALUES (${placeholders})`;
    await this.client.execute(query, values, { prepare: true });
    
    return id;
  }

  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    const ids: string[] = [];
    
    // Use batch insert for better performance
    const queries = data.map(item => {
      const id = item.id || this.generateUUID();
      ids.push(id);
      
      const columns = Object.keys(item).join(', ');
      const placeholders = Object.keys(item).map(() => '?').join(', ');
      
      return {
        query: `INSERT INTO ${collection} (${columns}) VALUES (${placeholders})`,
        params: Object.values(item)
      };
    });
    
    await this.client.batch(queries, { prepare: true });
    return ids;
  }

  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    // Build WHERE clause
    const whereConditions = Object.keys(query).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(query);
    
    const cqlQuery = whereConditions 
      ? `SELECT * FROM ${collection} WHERE ${whereConditions}`
      : `SELECT * FROM ${collection}`;
    
    const result = await this.client.execute(cqlQuery, values, { prepare: true });
    return result.rows;
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    // Build SET clause
    const setClause = Object.keys(update).map(key => `${key} = ?`).join(', ');
    const whereClause = Object.keys(query).map(key => `${key} = ?`).join(' AND ');
    
    const values = [...Object.values(update), ...Object.values(query)];
    
    const cqlQuery = `UPDATE ${collection} SET ${setClause} WHERE ${whereClause}`;
    await this.client.execute(cqlQuery, values, { prepare: true });
    
    // Cassandra doesn't return modified count easily, return 1 if successful
    return 1;
  }

  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    const whereClause = Object.keys(query).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(query);
    
    const cqlQuery = `DELETE FROM ${collection} WHERE ${whereClause}`;
    await this.client.execute(cqlQuery, values, { prepare: true });
    
    // Cassandra doesn't return deleted count easily, return 1 if successful
    return 1;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      await this.client.execute('SELECT now() FROM system.local');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Cassandra-specific: Execute raw CQL query
   * @param query CQL query string
   * @param params Query parameters
   */
  async executeQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    return await this.client.execute(query, params, { prepare: true });
  }

  /**
   * Cassandra-specific: Create a keyspace
   * @param keyspace Keyspace name
   * @param replicationFactor Replication factor
   */
  async createKeyspace(keyspace: string, replicationFactor: number = 1): Promise<void> {
    if (!this.client) throw new Error('Not connected to Cassandra');
    
    const query = `
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': ${replicationFactor}}
    `;
    
    await this.client.execute(query);
  }
}
