/**
 * Redis Example
 * Demonstrates common Redis operations using the RedisAdapter
 */

import { RedisAdapter, RedisConfig } from '../../lib/database/redis';

async function redisExample() {
  console.log('🔴 Redis Example\n');

  // Configuration
  const config: RedisConfig = {
    host: 'localhost',
    port: 6379,
    password: '', // Leave empty if no password
    database: 0
  };

  // Create adapter instance
  const adapter = new RedisAdapter(config);

  try {
    // Connect to Redis
    console.log('Connecting to Redis...');
    await adapter.connect();
    console.log('✓ Connected\n');

    // Health check
    const isHealthy = await adapter.healthCheck();
    console.log(`Health check: ${isHealthy ? '✓ Healthy' : '✗ Unhealthy'}\n`);

    // Insert a single user
    console.log('Inserting a user...');
    const userId = await adapter.insertOne('users', {
      id: 'user:1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log(`✓ Inserted user with ID: ${userId}\n`);

    // Insert multiple users
    console.log('Inserting multiple users...');
    const userIds = await adapter.insertMany('users', [
      { id: 'user:2', name: 'Jane Smith', email: 'jane@example.com', age: 28 },
      { id: 'user:3', name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
    ]);
    console.log(`✓ Inserted ${userIds.length} users\n`);

    // Find user by ID
    console.log('Finding user by ID...');
    const user = await adapter.findOne('users', { id: 'user:1' });
    console.log(`✓ Found user:`, user?.name, '\n');

    // Find all users
    console.log('Finding all users...');
    const users = await adapter.find('users', {});
    console.log(`✓ Found ${users.length} user(s)\n`);

    // Update user
    console.log('Updating user age...');
    const updateCount = await adapter.update(
      'users',
      { id: 'user:1' },
      { age: 31, updatedAt: new Date().toISOString() }
    );
    console.log(`✓ Updated ${updateCount} user(s)\n`);

    // Set with TTL (Redis-specific)
    console.log('Setting session with 1 hour TTL...');
    await adapter.setWithTTL('sessions', 'session:abc123', {
      userId: 'user:1',
      token: 'xyz789'
    }, 3600);
    console.log('✓ Session set with TTL\n');

    // Increment counter (Redis-specific)
    console.log('Incrementing page view counter...');
    const views = await adapter.increment('page:views', 1);
    console.log(`✓ Page views: ${views}\n`);

    // List operations (Redis-specific)
    console.log('Adding items to activity log...');
    await adapter.pushToList('activity:log', 'User logged in', 'User viewed page');
    const activities = await adapter.getListRange('activity:log', 0, -1);
    console.log(`✓ Activity log (${activities.length} items):`, activities, '\n');

    // Delete user
    console.log('Deleting user...');
    const deleteCount = await adapter.delete('users', { id: 'user:3' });
    console.log(`✓ Deleted ${deleteCount} user(s)\n`);

    console.log('Redis example completed successfully! ✨');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect
    await adapter.disconnect();
    console.log('\n✓ Disconnected from Redis');
  }
}

// Run the example
if (require.main === module) {
  redisExample().catch(console.error);
}

export { redisExample };
