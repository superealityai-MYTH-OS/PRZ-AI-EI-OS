/**
 * Amazon DynamoDB Database Adapter
 * Implements the DatabaseAdapter interface for DynamoDB
 * 
 * Installation: npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
 * Documentation: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-examples.html
 */

import { DatabaseAdapter, DatabaseConfig } from './base';

export interface DynamoDBConfig extends DatabaseConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string; // For local development
  tableName?: string; // Default table name
}

/**
 * DynamoDB adapter implementation
 * Note: DynamoDB requires tables to be created beforehand with proper key schema
 * 
 * Example usage:
 * ```typescript
 * const adapter = new DynamoDBAdapter({
 *   region: 'us-east-1',
 *   accessKeyId: 'YOUR_ACCESS_KEY',
 *   secretAccessKey: 'YOUR_SECRET_KEY',
 *   tableName: 'Users' // Optional default table
 * });
 * 
 * await adapter.connect();
 * 
 * // Insert data (collection parameter is the table name)
 * const id = await adapter.insertOne('Users', { 
 *   id: '123',
 *   name: 'John', 
 *   email: 'john@example.com' 
 * });
 * 
 * // Query data (requires partition key)
 * const users = await adapter.find('Users', { id: '123' });
 * 
 * // Scan with filter (expensive operation, use sparingly)
 * const usersByName = await adapter.scan('Users', { name: 'John' });
 * 
 * await adapter.disconnect();
 * ```
 */
export class DynamoDBAdapter implements DatabaseAdapter {
  private config: DynamoDBConfig;
  private client: any = null;
  private docClient: any = null;

  constructor(config: DynamoDBConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring AWS SDK as a hard dependency
      // @ts-ignore - Optional dependency
      const { DynamoDBClient } = await import('@aws-sdk/client-dynamodb');
      // @ts-ignore - Optional dependency
      const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');
      
      const clientConfig: any = {
        region: this.config.region,
      };

      if (this.config.accessKeyId && this.config.secretAccessKey) {
        clientConfig.credentials = {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        };
      }

      if (this.config.endpoint) {
        clientConfig.endpoint = this.config.endpoint;
      }

      this.client = new DynamoDBClient(clientConfig);
      this.docClient = DynamoDBDocumentClient.from(this.client);
    } catch (error) {
      throw new Error(`DynamoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.destroy();
      this.client = null;
      this.docClient = null;
    }
  }

  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.docClient) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    
    const id = data.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const item = { ...data, id };
    
    await this.docClient.send(new PutCommand({
      TableName: collection,
      Item: item
    }));
    
    return id;
  }

  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.docClient) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { BatchWriteCommand } = await import('@aws-sdk/lib-dynamodb');
    
    const ids: string[] = [];
    const items = data.map(item => {
      const id = item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      ids.push(id);
      return { ...item, id };
    });
    
    // DynamoDB batch write has a limit of 25 items
    const batches = [];
    for (let i = 0; i < items.length; i += 25) {
      batches.push(items.slice(i, i + 25));
    }
    
    for (const batch of batches) {
      const putRequests = batch.map(item => ({
        PutRequest: { Item: item }
      }));
      
      await this.docClient.send(new BatchWriteCommand({
        RequestItems: {
          [collection]: putRequests
        }
      }));
    }
    
    return ids;
  }

  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.docClient) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { QueryCommand } = await import('@aws-sdk/lib-dynamodb');
    
    // DynamoDB requires partition key in query
    // Assuming 'id' is the partition key
    if (!query.id) {
      // If no partition key, fall back to scan (expensive!)
      return await this.scan(collection, query);
    }
    
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues: Record<string, any> = {
      ':id': query.id
    };
    
    const result = await this.docClient.send(new QueryCommand({
      TableName: collection,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }));
    
    return result.Items || [];
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    if (!this.docClient) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
    
    if (query.id) {
      const result = await this.docClient.send(new GetCommand({
        TableName: collection,
        Key: { id: query.id }
      }));
      
      return result.Item || null;
    }
    
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.docClient) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { UpdateCommand } = await import('@aws-sdk/lib-dynamodb');
    
    // DynamoDB requires key to update
    if (!query.id) {
      throw new Error('Update requires "id" field in query');
    }
    
    const updateExpression = 'SET ' + Object.keys(update)
      .map((key, index) => `#field${index} = :value${index}`)
      .join(', ');
    
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    Object.keys(update).forEach((key, index) => {
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = update[key];
    });
    
    await this.docClient.send(new UpdateCommand({
      TableName: collection,
      Key: { id: query.id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }));
    
    return 1;
  }

  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.docClient) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
    
    if (!query.id) {
      throw new Error('Delete requires "id" field in query');
    }
    
    await this.docClient.send(new DeleteCommand({
      TableName: collection,
      Key: { id: query.id }
    }));
    
    return 1;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      // @ts-ignore - Optional dependency
      const { ListTablesCommand } = await import('@aws-sdk/client-dynamodb');
      await this.client.send(new ListTablesCommand({ Limit: 1 }));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * DynamoDB-specific: Scan table with filter (expensive operation)
   * @param tableName Table name
   * @param filter Filter conditions
   */
  async scan(tableName: string, filter?: Record<string, any>): Promise<any[]> {
    if (!this.docClient) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    
    const params: any = { TableName: tableName };
    
    if (filter && Object.keys(filter).length > 0) {
      const filterExpression = Object.keys(filter)
        .map((key, index) => `#field${index} = :value${index}`)
        .join(' AND ');
      
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};
      
      Object.keys(filter).forEach((key, index) => {
        expressionAttributeNames[`#field${index}`] = key;
        expressionAttributeValues[`:value${index}`] = filter[key];
      });
      
      params.FilterExpression = filterExpression;
      params.ExpressionAttributeNames = expressionAttributeNames;
      params.ExpressionAttributeValues = expressionAttributeValues;
    }
    
    const result = await this.docClient.send(new ScanCommand(params));
    return result.Items || [];
  }

  /**
   * DynamoDB-specific: Create a table
   * @param tableName Table name
   * @param keySchema Key schema definition
   * @param attributeDefinitions Attribute definitions
   */
  async createTable(
    tableName: string,
    keySchema: any[],
    attributeDefinitions: any[]
  ): Promise<void> {
    if (!this.client) throw new Error('Not connected to DynamoDB');
    
    // @ts-ignore - Optional dependency
    const { CreateTableCommand } = await import('@aws-sdk/client-dynamodb');
    
    await this.client.send(new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      BillingMode: 'PAY_PER_REQUEST'
    }));
  }
}
