/* * */

import { Collection, Db, MongoClient } from 'mongodb';
import type { Favorite } from './types.js';

/* * */

/**
 * MongoDB Connection Manager
 * 
 * Handles connection lifecycle and provides access to collections.
 * Uses connection string from environment variables.
 */
class Database {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    /**
     * Connect to MongoDB
     * Uses MONGODB_URI from environment variables
     */
    async connect(): Promise<void> {
        try {
            const uri = process.env.MONGODB_URI;
            if (!uri) {
                throw new Error('MONGODB_URI environment variable is not set');
            }

            console.log('Connecting to MongoDB...');
            this.client = new MongoClient(uri);
            await this.client.connect();

            // Extract database name from URI or use default
            this.db = this.client.db('production');

            // Create unique index on lineId to prevent duplicate favorites
            await this.getFavoritesCollection().createIndex(
                { lineId: 1 },
                { unique: true }
            );

            console.log('✅ Connected to MongoDB successfully');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    /**
     * Get the favorites collection
     * Ensures type safety with Favorite interface
     */
    getFavoritesCollection(): Collection<Favorite> {
        if (!this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db.collection<Favorite>('favorites');
    }

    /**
     * Gracefully close the database connection
     */
    async close(): Promise<void> {
        if (this.client) {
            await this.client.close();
            console.log('MongoDB connection closed');
        }
    }

    /**
     * Check if database is connected
     */
    isConnected(): boolean {
        return this.client !== null && this.db !== null;
    }
}

/* * */

// Export singleton instance
export const database = new Database();
