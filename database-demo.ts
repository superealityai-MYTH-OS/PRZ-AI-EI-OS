/**
 * Database Integration Demo
 * Demonstrates the usage of all database adapters
 */

import { DefaultDatabaseFactory } from './lib/database';

/**
 * This demo shows how to use the database factory pattern
 * to create adapters for different databases
 */
async function databaseDemo() {
  console.log('🗄️  PRZ-AI-EI-OS Database Integration Demo\n');
  console.log('='.repeat(60));
  console.log('\nThis demo demonstrates the modular database integration');
  console.log('system with support for 7 popular NoSQL databases.\n');
  console.log('='.repeat(60));

  // Example 1: Using the Factory Pattern
  console.log('\n\n📦 Example 1: Using the Database Factory\n');
  console.log('The factory pattern allows you to create database adapters');
  console.log('by specifying the database type and configuration:\n');

  console.log('```typescript');
  console.log('import { DefaultDatabaseFactory } from \'./lib/database\';');
  console.log('');
  console.log('const adapter = DefaultDatabaseFactory.createAdapter(\'mongodb\', {');
  console.log('  host: \'localhost\',');
  console.log('  port: 27017,');
  console.log('  database: \'myapp\'');
  console.log('});');
  console.log('');
  console.log('await adapter.connect();');
  console.log('const id = await adapter.insertOne(\'users\', { name: \'John\' });');
  console.log('await adapter.disconnect();');
  console.log('```');

  // Example 2: Direct Adapter Usage
  console.log('\n\n🔧 Example 2: Using Adapters Directly\n');
  console.log('You can also import and use adapters directly:\n');

  console.log('```typescript');
  console.log('import { MongoDBAdapter } from \'./lib/database/mongodb\';');
  console.log('import { RedisAdapter } from \'./lib/database/redis\';');
  console.log('');
  console.log('// MongoDB for persistent data');
  console.log('const mongodb = new MongoDBAdapter({ /* config */ });');
  console.log('await mongodb.connect();');
  console.log('');
  console.log('// Redis for caching');
  console.log('const redis = new RedisAdapter({ /* config */ });');
  console.log('await redis.connect();');
  console.log('```');

  // Supported Databases
  console.log('\n\n🌐 Supported Databases:\n');
  
  const databases = [
    {
      name: 'MongoDB',
      type: 'mongodb',
      description: 'Document database for flexible JSON documents',
      useCase: 'General-purpose, flexible schemas',
      install: 'npm install mongodb'
    },
    {
      name: 'Redis',
      type: 'redis',
      description: 'In-memory key-value store',
      useCase: 'Caching, sessions, real-time data',
      install: 'npm install redis'
    },
    {
      name: 'Apache Cassandra',
      type: 'cassandra',
      description: 'Distributed wide-column store',
      useCase: 'High write throughput, time-series',
      install: 'npm install cassandra-driver'
    },
    {
      name: 'Firebase Realtime Database',
      type: 'firebase',
      description: 'Real-time cloud database',
      useCase: 'Mobile/web apps, real-time sync',
      install: 'npm install firebase-admin'
    },
    {
      name: 'Firestore',
      type: 'firestore',
      description: 'Cloud document database',
      useCase: 'Mobile/web apps, offline support',
      install: 'npm install firebase-admin'
    },
    {
      name: 'Amazon DynamoDB',
      type: 'dynamodb',
      description: 'Serverless NoSQL database',
      useCase: 'Serverless apps, AWS integration',
      install: 'npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb'
    },
    {
      name: 'Couchbase',
      type: 'couchbase',
      description: 'High-performance JSON database',
      useCase: 'High-performance queries, N1QL',
      install: 'npm install couchbase'
    },
    {
      name: 'Neo4j',
      type: 'neo4j',
      description: 'Graph database',
      useCase: 'Relationships, connected data',
      install: 'npm install neo4j-driver'
    }
  ];

  databases.forEach((db, index) => {
    console.log(`${index + 1}. ${db.name}`);
    console.log(`   Type: ${db.type}`);
    console.log(`   Description: ${db.description}`);
    console.log(`   Best For: ${db.useCase}`);
    console.log(`   Install: ${db.install}`);
    console.log('');
  });

  // Common Operations
  console.log('\n📝 Common Operations:\n');
  console.log('All adapters support these standard operations:');
  console.log('');
  console.log('- connect()          - Establish database connection');
  console.log('- disconnect()       - Close database connection');
  console.log('- healthCheck()      - Check if database is healthy');
  console.log('- insertOne()        - Insert a single document');
  console.log('- insertMany()       - Insert multiple documents');
  console.log('- find()             - Find documents by query');
  console.log('- findOne()          - Find a single document');
  console.log('- update()           - Update documents');
  console.log('- delete()           - Delete documents');
  console.log('');

  // Advanced Features
  console.log('\n⚡ Database-Specific Features:\n');
  console.log('Each adapter also provides database-specific methods:');
  console.log('');
  console.log('- MongoDB: createIndex(), aggregate()');
  console.log('- Redis: setWithTTL(), increment(), pushToList()');
  console.log('- Cassandra: executeQuery(), createKeyspace()');
  console.log('- DynamoDB: scan(), createTable()');
  console.log('- Couchbase: query() (N1QL), upsert(), createPrimaryIndex()');
  console.log('- Neo4j: executeCypher(), createRelationship(), findRelated()');
  console.log('');

  // Configuration Examples
  console.log('\n⚙️  Configuration:\n');
  console.log('Example configuration files are available in:');
  console.log('  examples/database-configs/');
  console.log('');
  console.log('Example code is available in:');
  console.log('  examples/database-examples/');
  console.log('');

  // Documentation
  console.log('\n📖 Documentation:\n');
  console.log('For complete documentation, see DATABASE.md');
  console.log('');
  console.log('Quick links:');
  console.log('  - Installation guide');
  console.log('  - Configuration options for each database');
  console.log('  - Code examples');
  console.log('  - Best practices');
  console.log('  - Security guidelines');
  console.log('');

  // Next Steps
  console.log('\n🚀 Getting Started:\n');
  console.log('1. Install the database driver you need:');
  console.log('   npm install mongodb  # or redis, cassandra-driver, etc.');
  console.log('');
  console.log('2. Import the adapter:');
  console.log('   import { MongoDBAdapter } from \'./lib/database\';');
  console.log('');
  console.log('3. Create and configure the adapter:');
  console.log('   const db = new MongoDBAdapter({ /* config */ });');
  console.log('');
  console.log('4. Connect and use:');
  console.log('   await db.connect();');
  console.log('   // ... perform operations ...');
  console.log('   await db.disconnect();');
  console.log('');

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ PRZ-AI-EI-OS Database Integration Complete!');
  console.log('\n   Modular • Type-Safe • Production-Ready');
  console.log('\n' + '='.repeat(60) + '\n');
}

// Run the demo
if (require.main === module) {
  databaseDemo().catch(console.error);
}

export { databaseDemo };
