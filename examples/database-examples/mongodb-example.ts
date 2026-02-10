/**
 * MongoDB Example
 * Demonstrates common MongoDB operations using the MongoDBAdapter
 */

import { MongoDBAdapter, MongoDBConfig } from '../../lib/database/mongodb';

async function mongodbExample() {
  console.log('🍃 MongoDB Example\n');

  // Configuration
  const config: MongoDBConfig = {
    host: 'localhost',
    port: 27017,
    database: 'prz_demo',
    username: 'admin',
    password: 'password',
    authSource: 'admin'
  };

  // Create adapter instance
  const adapter = new MongoDBAdapter(config);

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await adapter.connect();
    console.log('✓ Connected\n');

    // Health check
    const isHealthy = await adapter.healthCheck();
    console.log(`Health check: ${isHealthy ? '✓ Healthy' : '✗ Unhealthy'}\n`);

    // Insert a single user
    console.log('Inserting a user...');
    const userId = await adapter.insertOne('users', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      createdAt: new Date()
    });
    console.log(`✓ Inserted user with ID: ${userId}\n`);

    // Insert multiple users
    console.log('Inserting multiple users...');
    const userIds = await adapter.insertMany('users', [
      { name: 'Jane Smith', email: 'jane@example.com', age: 28 },
      { name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
    ]);
    console.log(`✓ Inserted ${userIds.length} users\n`);

    // Find users
    console.log('Finding users named "John Doe"...');
    const users = await adapter.find('users', { name: 'John Doe' });
    console.log(`✓ Found ${users.length} user(s):`, users[0].email, '\n');

    // Find one user
    console.log('Finding a user by email...');
    const user = await adapter.findOne('users', { email: 'jane@example.com' });
    console.log(`✓ Found user:`, user?.name, '\n');

    // Update user
    console.log('Updating user age...');
    const updateCount = await adapter.update(
      'users',
      { email: 'john@example.com' },
      { age: 31, updatedAt: new Date() }
    );
    console.log(`✓ Updated ${updateCount} user(s)\n`);

    // Create an index (MongoDB-specific)
    console.log('Creating index on email field...');
    await adapter.createIndex('users', { email: 1 }, { unique: true });
    console.log('✓ Index created\n');

    // Aggregation example (MongoDB-specific)
    console.log('Running aggregation (average age)...');
    const ageStats = await adapter.aggregate('users', [
      { $group: { _id: null, avgAge: { $avg: '$age' } } }
    ]);
    console.log(`✓ Average age:`, ageStats[0]?.avgAge, '\n');

    // Delete user
    console.log('Deleting user...');
    const deleteCount = await adapter.delete('users', { email: 'bob@example.com' });
    console.log(`✓ Deleted ${deleteCount} user(s)\n`);

    console.log('MongoDB example completed successfully! ✨');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect
    await adapter.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

// Run the example
if (require.main === module) {
  mongodbExample().catch(console.error);
}

export { mongodbExample };
