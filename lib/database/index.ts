/**
 * Database Module Index
 * Exports all NoSQL database adapters and interfaces
 * 
 * This module provides a modular, pluggable approach to integrating
 * various NoSQL databases following PRZ OS principles.
 */

// Base interface and types
export { DatabaseAdapter, DatabaseConfig, DatabaseType, DatabaseFactory } from './base';

// MongoDB
export { MongoDBAdapter, MongoDBConfig } from './mongodb';

// Redis
export { RedisAdapter, RedisConfig } from './redis';

// Apache Cassandra
export { CassandraAdapter, CassandraConfig } from './cassandra';

// Firebase (Realtime Database and Firestore)
export { FirebaseRealtimeAdapter, FirestoreAdapter, FirebaseConfig } from './firebase';

// Amazon DynamoDB
export { DynamoDBAdapter, DynamoDBConfig } from './dynamodb';

// Couchbase
export { CouchbaseAdapter, CouchbaseConfig } from './couchbase';

// Neo4j
export { Neo4jAdapter, Neo4jConfig } from './neo4j';

/**
 * Database factory implementation
 * Creates database adapters based on type
 */
import { DatabaseAdapter, DatabaseType } from './base';

export class DefaultDatabaseFactory {
  /**
   * Create a database adapter instance
   * @param type Database type
   * @param config Database configuration
   * @returns Database adapter instance
   */
  static createAdapter(type: DatabaseType, config: any): DatabaseAdapter {
    switch (type) {
      case 'mongodb':
        // @ts-ignore - Dynamic require for optional dependency
        const { MongoDBAdapter } = require('./mongodb');
        return new MongoDBAdapter(config);
      
      case 'redis':
        // @ts-ignore - Dynamic require for optional dependency
        const { RedisAdapter } = require('./redis');
        return new RedisAdapter(config);
      
      case 'cassandra':
        // @ts-ignore - Dynamic require for optional dependency
        const { CassandraAdapter } = require('./cassandra');
        return new CassandraAdapter(config);
      
      case 'firebase':
        // @ts-ignore - Dynamic require for optional dependency
        const { FirebaseRealtimeAdapter } = require('./firebase');
        return new FirebaseRealtimeAdapter(config);
      
      case 'firestore':
        // @ts-ignore - Dynamic require for optional dependency
        const { FirestoreAdapter } = require('./firebase');
        return new FirestoreAdapter(config);
      
      case 'dynamodb':
        // @ts-ignore - Dynamic require for optional dependency
        const { DynamoDBAdapter } = require('./dynamodb');
        return new DynamoDBAdapter(config);
      
      case 'couchbase':
        // @ts-ignore - Dynamic require for optional dependency
        const { CouchbaseAdapter } = require('./couchbase');
        return new CouchbaseAdapter(config);
      
      case 'neo4j':
        // @ts-ignore - Dynamic require for optional dependency
        const { Neo4jAdapter } = require('./neo4j');
        return new Neo4jAdapter(config);
      
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
}
