/**
 * Neo4j Graph Database Adapter
 * Implements the DatabaseAdapter interface for Neo4j
 * 
 * Installation: npm install neo4j-driver
 * Documentation: https://neo4j.com/docs/javascript-manual/current/
 */

import { DatabaseAdapter, DatabaseConfig } from './base';

export interface Neo4jConfig extends DatabaseConfig {
  uri: string;
  username: string;
  password: string;
  database?: string;
  encrypted?: boolean;
}

/**
 * Neo4j adapter implementation
 * Note: Neo4j is a graph database, so the interface is adapted for node/relationship operations
 * 
 * Example usage:
 * ```typescript
 * const adapter = new Neo4jAdapter({
 *   uri: 'bolt://localhost:7687',
 *   username: 'neo4j',
 *   password: 'password',
 *   database: 'neo4j'
 * });
 * 
 * await adapter.connect();
 * 
 * // Create a node (collection becomes the label)
 * const id = await adapter.insertOne('Person', { 
 *   name: 'John', 
 *   email: 'john@example.com' 
 * });
 * 
 * // Find nodes by properties
 * const persons = await adapter.find('Person', { name: 'John' });
 * 
 * // Create a relationship between nodes
 * await adapter.createRelationship('Person', { name: 'John' }, 'KNOWS', 'Person', { name: 'Jane' });
 * 
 * // Query using Cypher
 * const friends = await adapter.executeCypher(
 *   'MATCH (p:Person {name: $name})-[:KNOWS]->(friend) RETURN friend',
 *   { name: 'John' }
 * );
 * 
 * await adapter.disconnect();
 * ```
 */
export class Neo4jAdapter implements DatabaseAdapter {
  private config: Neo4jConfig;
  private driver: any = null;

  constructor(config: Neo4jConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring Neo4j as a hard dependency
      // @ts-ignore - Optional dependency
      const neo4j = await import('neo4j-driver');
      
      this.driver = neo4j.driver(
        this.config.uri,
        neo4j.auth.basic(this.config.username, this.config.password),
        {
          encrypted: this.config.encrypted !== false ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF'
        }
      );

      // Verify connectivity
      await this.driver.verifyConnectivity();
    } catch (error) {
      throw new Error(`Neo4j connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
    }
  }

  /**
   * Insert a node (collection parameter becomes the node label)
   */
  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      const id = data.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const properties = { ...data, id };
      
      const cypher = `CREATE (n:${collection} $props) RETURN n.id as id`;
      const result = await session.run(cypher, { props: properties });
      
      return result.records[0].get('id');
    } finally {
      await session.close();
    }
  }

  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      const ids: string[] = [];
      const nodes = data.map(item => {
        const id = item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        ids.push(id);
        return { ...item, id };
      });
      
      const cypher = `UNWIND $nodes as node CREATE (n:${collection}) SET n = node RETURN n.id as id`;
      const result = await session.run(cypher, { nodes });
      
      return result.records.map((record: any) => record.get('id'));
    } finally {
      await session.close();
    }
  }

  /**
   * Find nodes by properties
   */
  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      let cypher = `MATCH (n:${collection})`;
      
      if (Object.keys(query).length > 0) {
        const whereConditions = Object.keys(query)
          .map(key => `n.${key} = $${key}`)
          .join(' AND ');
        cypher += ` WHERE ${whereConditions}`;
      }
      
      cypher += ' RETURN n';
      
      const result = await session.run(cypher, query);
      return result.records.map((record: any) => record.get('n').properties);
    } finally {
      await session.close();
    }
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update nodes by properties
   */
  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      let cypher = `MATCH (n:${collection})`;
      
      if (Object.keys(query).length > 0) {
        const whereConditions = Object.keys(query)
          .map(key => `n.${key} = $query_${key}`)
          .join(' AND ');
        cypher += ` WHERE ${whereConditions}`;
      }
      
      const setClause = Object.keys(update)
        .map(key => `n.${key} = $update_${key}`)
        .join(', ');
      
      cypher += ` SET ${setClause} RETURN count(n) as count`;
      
      const params: Record<string, any> = {};
      Object.keys(query).forEach(key => {
        params[`query_${key}`] = query[key];
      });
      Object.keys(update).forEach(key => {
        params[`update_${key}`] = update[key];
      });
      
      const result = await session.run(cypher, params);
      return result.records[0].get('count').toNumber();
    } finally {
      await session.close();
    }
  }

  /**
   * Delete nodes by properties
   */
  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      let cypher = `MATCH (n:${collection})`;
      
      if (Object.keys(query).length > 0) {
        const whereConditions = Object.keys(query)
          .map(key => `n.${key} = $${key}`)
          .join(' AND ');
        cypher += ` WHERE ${whereConditions}`;
      }
      
      cypher += ' DETACH DELETE n RETURN count(n) as count';
      
      const result = await session.run(cypher, query);
      return result.records[0].get('count').toNumber();
    } finally {
      await session.close();
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.driver) return false;
    
    try {
      await this.driver.verifyConnectivity();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Neo4j-specific: Execute Cypher query
   * @param cypher Cypher query string
   * @param params Query parameters
   */
  async executeCypher(cypher: string, params: Record<string, any> = {}): Promise<any[]> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      const result = await session.run(cypher, params);
      return result.records.map((record: any) => {
        const obj: Record<string, any> = {};
        record.keys.forEach((key: string) => {
          const value = record.get(key);
          // Convert Neo4j types to plain objects
          if (value && typeof value === 'object' && 'properties' in value) {
            obj[key] = value.properties;
          } else {
            obj[key] = value;
          }
        });
        return obj;
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Neo4j-specific: Create a relationship between nodes
   * @param fromLabel Label of the source node
   * @param fromQuery Query to find source node
   * @param relationshipType Type of relationship
   * @param toLabel Label of the target node
   * @param toQuery Query to find target node
   * @param properties Optional relationship properties
   */
  async createRelationship(
    fromLabel: string,
    fromQuery: Record<string, any>,
    relationshipType: string,
    toLabel: string,
    toQuery: Record<string, any>,
    properties?: Record<string, any>
  ): Promise<void> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      const fromWhere = Object.keys(fromQuery)
        .map(key => `from.${key} = $from_${key}`)
        .join(' AND ');
      
      const toWhere = Object.keys(toQuery)
        .map(key => `to.${key} = $to_${key}`)
        .join(' AND ');
      
      let cypher = `
        MATCH (from:${fromLabel}) WHERE ${fromWhere}
        MATCH (to:${toLabel}) WHERE ${toWhere}
        CREATE (from)-[r:${relationshipType}]->(to)
      `;
      
      if (properties) {
        cypher += ' SET r = $props';
      }
      
      cypher += ' RETURN r';
      
      const params: Record<string, any> = {};
      Object.keys(fromQuery).forEach(key => {
        params[`from_${key}`] = fromQuery[key];
      });
      Object.keys(toQuery).forEach(key => {
        params[`to_${key}`] = toQuery[key];
      });
      if (properties) {
        params.props = properties;
      }
      
      await session.run(cypher, params);
    } finally {
      await session.close();
    }
  }

  /**
   * Neo4j-specific: Find related nodes
   * @param label Node label
   * @param query Node properties to match
   * @param relationshipType Type of relationship
   * @param direction Direction: 'out' (outgoing), 'in' (incoming), or 'both'
   */
  async findRelated(
    label: string,
    query: Record<string, any>,
    relationshipType: string,
    direction: 'out' | 'in' | 'both' = 'out'
  ): Promise<any[]> {
    if (!this.driver) throw new Error('Not connected to Neo4j');
    
    const session = this.driver.session({ 
      database: this.config.database || 'neo4j' 
    });
    
    try {
      const whereConditions = Object.keys(query)
        .map(key => `n.${key} = $${key}`)
        .join(' AND ');
      
      let relationshipPattern: string;
      switch (direction) {
        case 'in':
          relationshipPattern = `<-[:${relationshipType}]-`;
          break;
        case 'both':
          relationshipPattern = `-[:${relationshipType}]-`;
          break;
        default: // 'out'
          relationshipPattern = `-[:${relationshipType}]->`;
      }
      
      const cypher = `
        MATCH (n:${label})${relationshipPattern}(related)
        WHERE ${whereConditions}
        RETURN related
      `;
      
      const result = await session.run(cypher, query);
      return result.records.map((record: any) => record.get('related').properties);
    } finally {
      await session.close();
    }
  }
}
