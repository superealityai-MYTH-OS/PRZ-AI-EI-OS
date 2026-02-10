/**
 * Neo4j Graph Database Example
 * Demonstrates graph operations using the Neo4jAdapter
 */

import { Neo4jAdapter, Neo4jConfig } from '../../lib/database/neo4j';

async function neo4jExample() {
  console.log('🕸️  Neo4j Graph Database Example\n');

  // Configuration
  const config: Neo4jConfig = {
    uri: 'bolt://localhost:7687',
    username: 'neo4j',
    password: 'password',
    database: 'neo4j',
    encrypted: false
  };

  // Create adapter instance
  const adapter = new Neo4jAdapter(config);

  try {
    // Connect to Neo4j
    console.log('Connecting to Neo4j...');
    await adapter.connect();
    console.log('✓ Connected\n');

    // Health check
    const isHealthy = await adapter.healthCheck();
    console.log(`Health check: ${isHealthy ? '✓ Healthy' : '✗ Unhealthy'}\n`);

    // Create person nodes
    console.log('Creating person nodes...');
    const johnId = await adapter.insertOne('Person', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log(`✓ Created person: John (${johnId})\n`);

    const janeId = await adapter.insertOne('Person', {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 28
    });
    console.log(`✓ Created person: Jane (${janeId})\n`);

    const bobId = await adapter.insertOne('Person', {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      age: 35
    });
    console.log(`✓ Created person: Bob (${bobId})\n`);

    // Create relationships
    console.log('Creating relationships...');
    await adapter.createRelationship(
      'Person',
      { name: 'John Doe' },
      'KNOWS',
      'Person',
      { name: 'Jane Smith' },
      { since: 2020 }
    );
    console.log('✓ John KNOWS Jane\n');

    await adapter.createRelationship(
      'Person',
      { name: 'John Doe' },
      'KNOWS',
      'Person',
      { name: 'Bob Johnson' },
      { since: 2018 }
    );
    console.log('✓ John KNOWS Bob\n');

    await adapter.createRelationship(
      'Person',
      { name: 'Jane Smith' },
      'KNOWS',
      'Person',
      { name: 'Bob Johnson' },
      { since: 2019 }
    );
    console.log('✓ Jane KNOWS Bob\n');

    // Find all persons
    console.log('Finding all persons...');
    const persons = await adapter.find('Person', {});
    console.log(`✓ Found ${persons.length} person(s)\n`);

    // Find John's friends
    console.log("Finding John's friends...");
    const friends = await adapter.findRelated(
      'Person',
      { name: 'John Doe' },
      'KNOWS',
      'out'
    );
    console.log(`✓ John has ${friends.length} friend(s):`, friends.map(f => f.name).join(', '), '\n');

    // Execute Cypher query to find mutual friends
    console.log('Finding mutual friends of John and Jane...');
    const mutualFriends = await adapter.executeCypher(`
      MATCH (john:Person {name: 'John Doe'})-[:KNOWS]->(mutual:Person)<-[:KNOWS]-(jane:Person {name: 'Jane Smith'})
      RETURN mutual.name as name, mutual.email as email
    `);
    console.log(`✓ Mutual friends:`, mutualFriends.map(f => f.name).join(', '), '\n');

    // Update person
    console.log('Updating person age...');
    const updateCount = await adapter.update(
      'Person',
      { name: 'John Doe' },
      { age: 31 }
    );
    console.log(`✓ Updated ${updateCount} person(s)\n`);

    // Path finding with Cypher
    console.log('Finding shortest path between John and Bob...');
    const paths = await adapter.executeCypher(`
      MATCH path = shortestPath((john:Person {name: 'John Doe'})-[*]-(bob:Person {name: 'Bob Johnson'}))
      RETURN length(path) as pathLength
    `);
    console.log(`✓ Shortest path length:`, paths[0]?.pathLength, '\n');

    // Delete a relationship and node
    console.log('Deleting a person...');
    const deleteCount = await adapter.delete('Person', { name: 'Bob Johnson' });
    console.log(`✓ Deleted ${deleteCount} person(s)\n`);

    console.log('Neo4j example completed successfully! ✨');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Clean up (optional - delete all created nodes)
    try {
      await adapter.executeCypher('MATCH (p:Person) DETACH DELETE p');
      console.log('✓ Cleaned up test data');
    } catch (e) {
      // Ignore cleanup errors
    }

    // Disconnect
    await adapter.disconnect();
    console.log('\n✓ Disconnected from Neo4j');
  }
}

// Run the example
if (require.main === module) {
  neo4jExample().catch(console.error);
}

export { neo4jExample };
