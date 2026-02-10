/**
 * Redis Database Adapter
 * Implements the DatabaseAdapter interface for Redis
 * 
 * Installation: npm install redis
 * Documentation: https://redis.io/docs/clients/nodejs/
 */

import { DatabaseAdapter, DatabaseConfig } from './base';

export interface RedisConfig extends DatabaseConfig {
  host?: string;
  port?: number;
  password?: string;
  database?: number; // Redis database number (0-15)
  url?: string;
  tls?: boolean;
  maxRetriesPerRequest?: number;
}

/**
 * Redis adapter implementation
 * Note: Redis is a key-value store, so collection parameter is used as key prefix
 * 
 * Example usage:
 * ```typescript
 * const adapter = new RedisAdapter({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'mypassword'
 * });
 * 
 * await adapter.connect();
 * 
 * // Store user data (collection:id format)
 * const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
 * 
 * // Retrieve by key pattern
 * const users = await adapter.find('users', { id: '123' });
 * 
 * // Set with TTL (Time To Live)
 * await adapter.setWithTTL('sessions', 'session-123', { userId: '456' }, 3600);
 * 
 * await adapter.disconnect();
 * ```
 */
export class RedisAdapter implements DatabaseAdapter {
  private config: RedisConfig;
  private client: any = null;

  constructor(config: RedisConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring Redis as a hard dependency
      // @ts-ignore - Optional dependency
      const { createClient } = await import('redis');
      
      const options: any = {};
      
      if (this.config.url) {
        options.url = this.config.url;
      } else {
        options.socket = {
          host: this.config.host || 'localhost',
          port: this.config.port || 6379,
        };
        
        if (this.config.password) {
          options.password = this.config.password;
        }
        
        if (this.config.database !== undefined) {
          options.database = this.config.database;
        }
      }

      this.client = createClient(options);
      
      this.client.on('error', (err: Error) => {
        // Error handler for Redis client errors
        // In production, consider using a proper logging solution
      });

      await this.client.connect();
    } catch (error) {
      throw new Error(`Redis connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  /**
   * Insert a document (stores as JSON with auto-generated ID)
   */
  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    const id = data.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const key = `${collection}:${id}`;
    
    await this.client.set(key, JSON.stringify(data));
    return id;
  }

  /**
   * Insert multiple documents
   */
  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    const ids: string[] = [];
    
    for (const item of data) {
      const id = await this.insertOne(collection, item);
      ids.push(id);
    }
    
    return ids;
  }

  /**
   * Find documents by pattern matching (limited query support)
   * Note: Redis find is limited compared to document databases
   */
  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    const pattern = query.id ? `${collection}:${query.id}` : `${collection}:*`;
    const keys = await this.client.keys(pattern);
    
    const results: any[] = [];
    for (const key of keys) {
      const value = await this.client.get(key);
      if (value) {
        const parsed = JSON.parse(value);
        
        // Simple query matching
        const matches = Object.keys(query).every(k => {
          if (k === 'id') return true; // Already filtered by pattern
          return parsed[k] === query[k];
        });
        
        if (matches) {
          results.push(parsed);
        }
      }
    }
    
    return results;
  }

  /**
   * Find a single document
   */
  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    if (query.id) {
      const key = `${collection}:${query.id}`;
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    }
    
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update documents (finds and updates matching keys)
   */
  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    const documents = await this.find(collection, query);
    let count = 0;
    
    for (const doc of documents) {
      const key = `${collection}:${doc.id}`;
      const updated = { ...doc, ...update };
      await this.client.set(key, JSON.stringify(updated));
      count++;
    }
    
    return count;
  }

  /**
   * Delete documents matching query
   */
  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    const documents = await this.find(collection, query);
    
    for (const doc of documents) {
      const key = `${collection}:${doc.id}`;
      await this.client.del(key);
    }
    
    return documents.length;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Redis-specific: Set a value with TTL (Time To Live)
   * @param collection Key prefix
   * @param key Key name
   * @param value Value to store
   * @param ttlSeconds TTL in seconds
   */
  async setWithTTL(collection: string, key: string, value: any, ttlSeconds: number): Promise<void> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    const fullKey = `${collection}:${key}`;
    await this.client.setEx(fullKey, ttlSeconds, JSON.stringify(value));
  }

  /**
   * Redis-specific: Increment a counter
   * @param key Key name
   * @param increment Amount to increment (default: 1)
   */
  async increment(key: string, increment: number = 1): Promise<number> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    return await this.client.incrBy(key, increment);
  }

  /**
   * Redis-specific: Add to a list
   * @param key List key
   * @param values Values to push
   */
  async pushToList(key: string, ...values: string[]): Promise<number> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    return await this.client.rPush(key, values);
  }

  /**
   * Redis-specific: Get list items
   * @param key List key
   * @param start Start index
   * @param end End index
   */
  async getListRange(key: string, start: number = 0, end: number = -1): Promise<string[]> {
    if (!this.client) throw new Error('Not connected to Redis');
    
    return await this.client.lRange(key, start, end);
  }
}
