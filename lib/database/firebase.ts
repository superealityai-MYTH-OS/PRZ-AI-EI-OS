/**
 * Firebase Database Adapters (Realtime Database & Firestore)
 * Implements the DatabaseAdapter interface for Firebase
 * 
 * Installation: npm install firebase-admin
 * Documentation: https://firebase.google.com/docs/admin/setup
 */

import { DatabaseAdapter, DatabaseConfig } from './base';

export interface FirebaseConfig extends DatabaseConfig {
  projectId: string;
  serviceAccountPath?: string;
  serviceAccountJson?: any;
  databaseURL?: string; // For Realtime Database
}

/**
 * Firebase Realtime Database adapter
 * 
 * Example usage:
 * ```typescript
 * const adapter = new FirebaseRealtimeAdapter({
 *   projectId: 'my-project',
 *   serviceAccountPath: './serviceAccountKey.json',
 *   databaseURL: 'https://my-project.firebaseio.com'
 * });
 * 
 * await adapter.connect();
 * 
 * // Insert data
 * const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
 * 
 * // Query data
 * const users = await adapter.find('users', { name: 'John' });
 * 
 * await adapter.disconnect();
 * ```
 */
export class FirebaseRealtimeAdapter implements DatabaseAdapter {
  private config: FirebaseConfig;
  private app: any = null;
  private database: any = null;

  constructor(config: FirebaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring Firebase as a hard dependency
      // @ts-ignore - Optional dependency
      const admin = await import('firebase-admin');
      
      let credential;
      if (this.config.serviceAccountPath) {
        // @ts-ignore - Dynamic require for service account
        const serviceAccount = require(this.config.serviceAccountPath);
        credential = admin.credential.cert(serviceAccount);
      } else if (this.config.serviceAccountJson) {
        credential = admin.credential.cert(this.config.serviceAccountJson);
      } else {
        credential = admin.credential.applicationDefault();
      }

      this.app = admin.initializeApp({
        credential,
        databaseURL: this.config.databaseURL
      });

      this.database = admin.database();
    } catch (error) {
      throw new Error(`Firebase Realtime Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.app) {
      await this.app.delete();
      this.app = null;
      this.database = null;
    }
  }

  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.database) throw new Error('Not connected to Firebase Realtime Database');
    
    const ref = this.database.ref(collection).push();
    await ref.set(data);
    return ref.key;
  }

  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.database) throw new Error('Not connected to Firebase Realtime Database');
    
    const ids: string[] = [];
    const updates: Record<string, any> = {};
    
    for (const item of data) {
      const key = this.database.ref(collection).push().key;
      updates[`${collection}/${key}`] = item;
      ids.push(key);
    }
    
    await this.database.ref().update(updates);
    return ids;
  }

  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.database) throw new Error('Not connected to Firebase Realtime Database');
    
    const ref = this.database.ref(collection);
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    
    if (!data) return [];
    
    // Filter results based on query
    const results: any[] = [];
    for (const [id, value] of Object.entries(data)) {
      const matches = Object.keys(query).every(key => (value as any)[key] === query[key]);
      if (matches) {
        results.push({ id, ...(value as any) });
      }
    }
    
    return results;
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.database) throw new Error('Not connected to Firebase Realtime Database');
    
    const documents = await this.find(collection, query);
    const updates: Record<string, any> = {};
    
    for (const doc of documents) {
      for (const [key, value] of Object.entries(update)) {
        updates[`${collection}/${doc.id}/${key}`] = value;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await this.database.ref().update(updates);
    }
    
    return documents.length;
  }

  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.database) throw new Error('Not connected to Firebase Realtime Database');
    
    const documents = await this.find(collection, query);
    
    for (const doc of documents) {
      await this.database.ref(`${collection}/${doc.id}`).remove();
    }
    
    return documents.length;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.database) return false;
    
    try {
      await this.database.ref('.info/connected').once('value');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Firebase Firestore adapter
 * 
 * Example usage:
 * ```typescript
 * const adapter = new FirestoreAdapter({
 *   projectId: 'my-project',
 *   serviceAccountPath: './serviceAccountKey.json'
 * });
 * 
 * await adapter.connect();
 * 
 * // Insert data
 * const id = await adapter.insertOne('users', { name: 'John', email: 'john@example.com' });
 * 
 * // Query data
 * const users = await adapter.find('users', { name: 'John' });
 * 
 * await adapter.disconnect();
 * ```
 */
export class FirestoreAdapter implements DatabaseAdapter {
  private config: FirebaseConfig;
  private app: any = null;
  private firestore: any = null;

  constructor(config: FirebaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Dynamic import to avoid requiring Firebase as a hard dependency
      // @ts-ignore - Optional dependency
      const admin = await import('firebase-admin');
      
      let credential;
      if (this.config.serviceAccountPath) {
        // @ts-ignore - Dynamic require for service account
        const serviceAccount = require(this.config.serviceAccountPath);
        credential = admin.credential.cert(serviceAccount);
      } else if (this.config.serviceAccountJson) {
        credential = admin.credential.cert(this.config.serviceAccountJson);
      } else {
        credential = admin.credential.applicationDefault();
      }

      this.app = admin.initializeApp({
        credential,
        projectId: this.config.projectId
      });

      this.firestore = admin.firestore();
    } catch (error) {
      throw new Error(`Firestore connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.app) {
      await this.app.delete();
      this.app = null;
      this.firestore = null;
    }
  }

  async insertOne(collection: string, data: any): Promise<string> {
    if (!this.firestore) throw new Error('Not connected to Firestore');
    
    const docRef = await this.firestore.collection(collection).add(data);
    return docRef.id;
  }

  async insertMany(collection: string, data: any[]): Promise<string[]> {
    if (!this.firestore) throw new Error('Not connected to Firestore');
    
    const batch = this.firestore.batch();
    const ids: string[] = [];
    
    for (const item of data) {
      const docRef = this.firestore.collection(collection).doc();
      batch.set(docRef, item);
      ids.push(docRef.id);
    }
    
    await batch.commit();
    return ids;
  }

  async find(collection: string, query: Record<string, any>): Promise<any[]> {
    if (!this.firestore) throw new Error('Not connected to Firestore');
    
    let ref: any = this.firestore.collection(collection);
    
    // Apply query filters
    for (const [key, value] of Object.entries(query)) {
      ref = ref.where(key, '==', value);
    }
    
    const snapshot = await ref.get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    if (!this.firestore) throw new Error('Not connected to Firestore');
    
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  async update(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<number> {
    if (!this.firestore) throw new Error('Not connected to Firestore');
    
    const documents = await this.find(collection, query);
    const batch = this.firestore.batch();
    
    for (const doc of documents) {
      const docRef = this.firestore.collection(collection).doc(doc.id);
      batch.update(docRef, update);
    }
    
    await batch.commit();
    return documents.length;
  }

  async delete(collection: string, query: Record<string, any>): Promise<number> {
    if (!this.firestore) throw new Error('Not connected to Firestore');
    
    const documents = await this.find(collection, query);
    const batch = this.firestore.batch();
    
    for (const doc of documents) {
      const docRef = this.firestore.collection(collection).doc(doc.id);
      batch.delete(docRef);
    }
    
    await batch.commit();
    return documents.length;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.firestore) return false;
    
    try {
      await this.firestore.collection('_health_check').limit(1).get();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Firestore-specific: Run a transaction
   * @param callback Transaction callback
   */
  async runTransaction(callback: (transaction: any) => Promise<any>): Promise<any> {
    if (!this.firestore) throw new Error('Not connected to Firestore');
    
    return await this.firestore.runTransaction(callback);
  }
}
