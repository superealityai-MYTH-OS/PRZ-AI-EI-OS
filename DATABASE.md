# NoSQL Database Integration Guide

This guide provides comprehensive documentation for integrating popular NoSQL databases into your PRZ-AI-EI-OS projects. Each database adapter follows a common interface while providing database-specific features.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Supported Databases](#supported-databases)
4. [Common Interface](#common-interface)
5. [Database-Specific Guides](#database-specific-guides)
   - [MongoDB](#mongodb)
   - [Redis](#redis)
   - [Apache Cassandra](#apache-cassandra)
   - [Firebase (Realtime Database & Firestore)](#firebase)
   - [Amazon DynamoDB](#amazon-dynamodb)
   - [Couchbase](#couchbase)
   - [Neo4j](#neo4j)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

## Overview

The PRZ-AI-EI-OS database module provides modular, pluggable adapters for various NoSQL databases. All adapters implement a common `DatabaseAdapter` interface, making it easy to switch between databases or use multiple databases in the same project.

**Key Features:**
- ✅ Unified interface across all databases
- ✅ TypeScript support with full type definitions
- ✅ Optional dependencies (install only what you need)
- ✅ Database-specific methods for advanced features
- ✅ Comprehensive error handling
- ✅ Health checks and connection management

## Installation

### Core Module (No Dependencies)

The database module itself has no required dependencies:

```bash
npm install
```

### Database-Specific Dependencies

Install only the databases you plan to use:

```bash
# MongoDB
npm install mongodb

# Redis
npm install redis

# Apache Cassandra
npm install cassandra-driver

# Firebase (Realtime Database & Firestore)
npm install firebase-admin

# Amazon DynamoDB
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb

# Couchbase
npm install couchbase

# Neo4j
npm install neo4j-driver
```

## Supported Databases

| Database | Type | Best For | Adapter Class |
|----------|------|----------|---------------|
| **MongoDB** | Document Store | Flexible schemas, JSON documents | `MongoDBAdapter` |
| **Redis** | Key-Value Store | Caching, sessions, real-time data | `RedisAdapter` |
| **Cassandra** | Wide-Column Store | High write throughput, time-series | `CassandraAdapter` |
| **Firebase** | Real-time Database | Mobile/web apps, real-time sync | `FirebaseRealtimeAdapter` |
| **Firestore** | Document Store | Mobile/web apps, offline support | `FirestoreAdapter` |
| **DynamoDB** | Key-Value/Document | Serverless, AWS integration | `DynamoDBAdapter` |
| **Couchbase** | Document Store | High performance, N1QL queries | `CouchbaseAdapter` |
| **Neo4j** | Graph Database | Relationships, connected data | `Neo4jAdapter` |

## Common Interface

All database adapters implement the `DatabaseAdapter` interface:

```typescript
interface DatabaseAdapter {
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;

  // CRUD operations
  insertOne(collection: string, data: any): Promise<string>;
  insertMany(collection: string, data: any[]): Promise<string[]>;
  find(collection: string, query: Record<string, any>): Promise<any[]>;
  findOne(collection: string, query: Record<string, any>): Promise<any | null>;
  update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number>;
  delete(collection: string, query: Record<string, any>): Promise<number>;
}
```

## Database-Specific Guides

### MongoDB

**Best For:** Flexible document storage, complex queries, aggregation pipelines

**Installation:**
```bash
npm install mongodb
```

**Basic Usage:**
```typescript
import { MongoDBAdapter } from './lib/database/mongodb';

const adapter = new MongoDBAdapter({
  host: 'localhost',
  port: 27017,
  database: 'myapp',
  username: 'admin',
  password: 'password'
});

await adapter.connect();
const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
await adapter.disconnect();
```

**Configuration Options:**
- `host` / `port` - Database server location
- `uri` - Full connection string (alternative to host/port)
- `database` - Database name
- `username` / `password` - Authentication credentials
- `authSource` - Authentication database (default: 'admin')
- `ssl` - Enable SSL/TLS connection
- `maxPoolSize` - Connection pool size

**MongoDB-Specific Methods:**
```typescript
// Create an index
await adapter.createIndex('users', { email: 1 }, { unique: true });

// Aggregation pipeline
const results = await adapter.aggregate('users', [
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: '$country', count: { $sum: 1 } } }
]);
```

**Example Config:** See `examples/database-configs/mongodb.config.json`

---

### Redis

**Best For:** Caching, session storage, pub/sub, real-time leaderboards

**Installation:**
```bash
npm install redis
```

**Basic Usage:**
```typescript
import { RedisAdapter } from './lib/database/redis';

const adapter = new RedisAdapter({
  host: 'localhost',
  port: 6379,
  password: 'optional-password',
  database: 0
});

await adapter.connect();
await adapter.insertOne('users', { id: 'user:1', name: 'John' });
const user = await adapter.findOne('users', { id: 'user:1' });
await adapter.disconnect();
```

**Configuration Options:**
- `host` / `port` - Redis server location
- `url` - Full connection URL (alternative)
- `password` - Authentication password
- `database` - Database number (0-15)
- `tls` - Enable TLS encryption

**Redis-Specific Methods:**
```typescript
// Set with TTL (Time To Live)
await adapter.setWithTTL('sessions', 'session-123', { userId: '456' }, 3600);

// Increment counter
const views = await adapter.increment('page:views', 1);

// List operations
await adapter.pushToList('activity:log', 'User logged in');
const activities = await adapter.getListRange('activity:log', 0, -1);
```

**Example Config:** See `examples/database-configs/redis.config.json`

---

### Apache Cassandra

**Best For:** High write throughput, time-series data, distributed systems

**Installation:**
```bash
npm install cassandra-driver
```

**Basic Usage:**
```typescript
import { CassandraAdapter } from './lib/database/cassandra';

const adapter = new CassandraAdapter({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'myapp',
  username: 'cassandra',
  password: 'cassandra'
});

await adapter.connect();

// Create table first (required)
await adapter.executeQuery(`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT
  )
`);

const id = await adapter.insertOne('users', { 
  id: 'uuid-here', 
  name: 'John', 
  email: 'john@example.com' 
});

await adapter.disconnect();
```

**Configuration Options:**
- `contactPoints` - Array of node addresses
- `localDataCenter` - Data center name
- `keyspace` - Keyspace name
- `username` / `password` - Authentication credentials
- `port` - CQL port (default: 9042)

**Cassandra-Specific Methods:**
```typescript
// Execute CQL query
await adapter.executeQuery('SELECT * FROM users WHERE id = ?', [userId]);

// Create keyspace
await adapter.createKeyspace('myapp', 3); // replication factor = 3
```

**Example Config:** See `examples/database-configs/cassandra.config.json`

---

### Firebase

**Best For:** Mobile/web apps, real-time synchronization, offline support

**Installation:**
```bash
npm install firebase-admin
```

**Basic Usage (Realtime Database):**
```typescript
import { FirebaseRealtimeAdapter } from './lib/database/firebase';

const adapter = new FirebaseRealtimeAdapter({
  projectId: 'my-project',
  serviceAccountPath: './serviceAccountKey.json',
  databaseURL: 'https://my-project.firebaseio.com'
});

await adapter.connect();
const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
await adapter.disconnect();
```

**Basic Usage (Firestore):**
```typescript
import { FirestoreAdapter } from './lib/database/firebase';

const adapter = new FirestoreAdapter({
  projectId: 'my-project',
  serviceAccountPath: './serviceAccountKey.json'
});

await adapter.connect();
const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
await adapter.disconnect();
```

**Configuration Options:**
- `projectId` - Firebase project ID
- `serviceAccountPath` - Path to service account JSON file
- `serviceAccountJson` - Service account JSON object (alternative)
- `databaseURL` - Realtime Database URL (Realtime DB only)

**Firestore-Specific Methods:**
```typescript
// Run a transaction
await adapter.runTransaction(async (transaction) => {
  const docRef = firestore.collection('users').doc('user1');
  const doc = await transaction.get(docRef);
  const newBalance = doc.data().balance + 100;
  transaction.update(docRef, { balance: newBalance });
});
```

**Example Config:** See `examples/database-configs/firebase.config.json`

---

### Amazon DynamoDB

**Best For:** Serverless applications, AWS ecosystem, variable workloads

**Installation:**
```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

**Basic Usage:**
```typescript
import { DynamoDBAdapter } from './lib/database/dynamodb';

const adapter = new DynamoDBAdapter({
  region: 'us-east-1',
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY'
});

await adapter.connect();
const id = await adapter.insertOne('Users', { 
  id: '123',
  name: 'John', 
  email: 'john@example.com' 
});
await adapter.disconnect();
```

**Configuration Options:**
- `region` - AWS region
- `accessKeyId` / `secretAccessKey` - AWS credentials
- `endpoint` - Custom endpoint (for local DynamoDB)

**DynamoDB-Specific Methods:**
```typescript
// Scan table (expensive, use sparingly)
const allUsers = await adapter.scan('Users');

// Scan with filter
const activeUsers = await adapter.scan('Users', { status: 'active' });

// Create table
await adapter.createTable('Users', 
  [{ AttributeName: 'id', KeyType: 'HASH' }],
  [{ AttributeName: 'id', AttributeType: 'S' }]
);
```

**Important Notes:**
- DynamoDB requires tables to be created beforehand
- Query operations require partition key
- Use `scan()` method for queries without partition key (expensive)

**Example Config:** See `examples/database-configs/dynamodb.config.json`

---

### Couchbase

**Best For:** High-performance applications, N1QL queries, mobile sync

**Installation:**
```bash
npm install couchbase
```

**Basic Usage:**
```typescript
import { CouchbaseAdapter } from './lib/database/couchbase';

const adapter = new CouchbaseAdapter({
  connectionString: 'couchbase://localhost',
  username: 'Administrator',
  password: 'password',
  bucketName: 'myBucket'
});

await adapter.connect();
const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
await adapter.disconnect();
```

**Configuration Options:**
- `connectionString` - Couchbase cluster URL
- `username` / `password` - Authentication credentials
- `bucketName` - Bucket name
- `scopeName` - Scope name (default: '_default')
- `collectionName` - Collection name (default: '_default')

**Couchbase-Specific Methods:**
```typescript
// N1QL query
const results = await adapter.query(
  'SELECT * FROM users WHERE age > $1',
  [18]
);

// Upsert (insert or update)
await adapter.upsert('user::123', { name: 'John', age: 31 });

// Create primary index
await adapter.createPrimaryIndex('idx_users');
```

**Example Config:** See `examples/database-configs/couchbase.config.json`

---

### Neo4j

**Best For:** Graph data, social networks, recommendation engines, connected data

**Installation:**
```bash
npm install neo4j-driver
```

**Basic Usage:**
```typescript
import { Neo4jAdapter } from './lib/database/neo4j';

const adapter = new Neo4jAdapter({
  uri: 'bolt://localhost:7687',
  username: 'neo4j',
  password: 'password',
  database: 'neo4j'
});

await adapter.connect();

// Create nodes
const johnId = await adapter.insertOne('Person', { 
  name: 'John', 
  email: 'john@example.com' 
});

// Create relationships
await adapter.createRelationship(
  'Person', { name: 'John' },
  'KNOWS',
  'Person', { name: 'Jane' }
);

// Find related nodes
const friends = await adapter.findRelated('Person', { name: 'John' }, 'KNOWS');

await adapter.disconnect();
```

**Configuration Options:**
- `uri` - Neo4j connection URI (bolt://, neo4j://, neo4j+s://)
- `username` / `password` - Authentication credentials
- `database` - Database name
- `encrypted` - Enable encryption (default: true)

**Neo4j-Specific Methods:**
```typescript
// Execute Cypher query
const results = await adapter.executeCypher(
  'MATCH (p:Person)-[:KNOWS]->(friend) WHERE p.name = $name RETURN friend',
  { name: 'John' }
);

// Create relationship
await adapter.createRelationship(
  'Person', { name: 'John' },
  'FOLLOWS',
  'Person', { name: 'Jane' },
  { since: 2020 }
);

// Find related nodes
const followers = await adapter.findRelated('Person', { name: 'John' }, 'FOLLOWS', 'in');
```

**Example Config:** See `examples/database-configs/neo4j.config.json`

---

## Usage Examples

### Basic Example: Using the Factory Pattern

```typescript
import { DefaultDatabaseFactory } from './lib/database';

// Create adapter using factory
const adapter = DefaultDatabaseFactory.createAdapter('mongodb', {
  host: 'localhost',
  port: 27017,
  database: 'myapp'
});

await adapter.connect();

// Perform operations
const id = await adapter.insertOne('users', { name: 'John' });
const users = await adapter.find('users', { name: 'John' });

await adapter.disconnect();
```

### Multi-Database Example

```typescript
import { MongoDBAdapter } from './lib/database/mongodb';
import { RedisAdapter } from './lib/database/redis';

// Use MongoDB for persistent storage
const mongodb = new MongoDBAdapter({ /* config */ });
await mongodb.connect();

// Use Redis for caching
const redis = new RedisAdapter({ /* config */ });
await redis.connect();

// Save to MongoDB
const userId = await mongodb.insertOne('users', { 
  name: 'John', 
  email: 'john@example.com' 
});

// Cache in Redis
await redis.setWithTTL('cache', `user:${userId}`, { name: 'John' }, 3600);

// Disconnect both
await mongodb.disconnect();
await redis.disconnect();
```

### Complete Examples

See the `examples/database-examples/` directory for complete, runnable examples:
- `mongodb-example.ts` - MongoDB operations
- `redis-example.ts` - Redis operations
- `neo4j-example.ts` - Neo4j graph operations

Run examples:
```bash
# Build the project
npm run build

# Compile and run example
npx tsc examples/database-examples/mongodb-example.ts --outDir ./dist --module commonjs --esModuleInterop
node dist/examples/database-examples/mongodb-example.js
```

## Best Practices

### 1. Connection Management

Always properly close connections:

```typescript
try {
  await adapter.connect();
  // ... operations ...
} finally {
  await adapter.disconnect();
}
```

### 2. Error Handling

Wrap database operations in try-catch blocks:

```typescript
try {
  const user = await adapter.findOne('users', { email });
  if (!user) {
    throw new Error('User not found');
  }
} catch (error) {
  console.error('Database error:', error);
  // Handle error appropriately
}
```

### 3. Environment Variables

Store credentials in environment variables:

```typescript
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '27017'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};
```

### 4. Health Checks

Implement health checks for monitoring:

```typescript
async function checkDatabaseHealth() {
  const isHealthy = await adapter.healthCheck();
  if (!isHealthy) {
    console.error('Database is unhealthy!');
    // Implement reconnection logic or alerting
  }
  return isHealthy;
}
```

### 5. Choose the Right Database

| Use Case | Recommended Database |
|----------|---------------------|
| Flexible JSON documents | MongoDB, Firestore |
| Caching & sessions | Redis |
| Time-series data | Cassandra |
| Real-time sync | Firebase Realtime DB |
| Serverless apps | DynamoDB, Firestore |
| Graph relationships | Neo4j |
| High-performance queries | Couchbase |

### 6. Security

- Never commit credentials to version control
- Use environment variables or secret management systems
- Enable SSL/TLS for production databases
- Follow principle of least privilege for database users
- Regularly rotate credentials

### 7. Performance

- Use indexes appropriately (MongoDB, Cassandra, Couchbase)
- Implement caching with Redis for frequently accessed data
- Use batch operations for bulk inserts
- Monitor query performance and optimize as needed

---

## Additional Resources

- **MongoDB:** https://www.mongodb.com/docs/
- **Redis:** https://redis.io/docs/
- **Cassandra:** https://cassandra.apache.org/doc/
- **Firebase:** https://firebase.google.com/docs
- **DynamoDB:** https://docs.aws.amazon.com/dynamodb/
- **Couchbase:** https://docs.couchbase.com/
- **Neo4j:** https://neo4j.com/docs/

---

**Part of the PRZ-AI-EI-OS project**  
Following PRZ OS principles: Complete, Modular, and Resonance-aligned 🌀
