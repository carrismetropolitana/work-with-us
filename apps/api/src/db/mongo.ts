import type { Favorite } from '../types.js';

import { type Collection, MongoClient } from 'mongodb';

import { config } from '../config.js';

let client: MongoClient | null = null;

export async function connectMongo(): Promise<MongoClient> {
	if (client) return client;
	client = new MongoClient(config.mongo_uri);
	await client.connect();
	await ensureIndexes();
	return client;
}

export function favoritesCollection(): Collection<Favorite> {
	if (!client) throw new Error('Mongo not connected — call connectMongo() first');
	return client.db(config.mongo_db).collection<Favorite>('favorites');
}

async function ensureIndexes(): Promise<void> {
	await favoritesCollection().createIndex({ line_id: 1 }, { unique: true });
}

export async function disconnectMongo(): Promise<void> {
	if (!client) return;
	await client.close();
	client = null;
}
