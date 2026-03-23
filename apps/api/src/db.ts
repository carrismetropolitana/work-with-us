import { Collection, Db, MongoClient } from 'mongodb';

export interface Favorite {
	createdAt: number
	lineId: string
	operationalDate: string
}

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI
	= process.env.MONGODB_URI || 'mongodb://root:root@localhost:37001';

const DB_NAME = process.env.MONGODB_DB || 'production';

export async function connectDb() {
	if (db) return db;

	client = new MongoClient(MONGODB_URI);
	await client.connect();

	db = client.db(DB_NAME);

	await db.collection<Favorite>('favorites').createIndex(
		{ lineId: 1 },
		{ unique: true },
	);

	return db;
}

export function getFavoritesCollection(): Collection<Favorite> {
	if (!db) {
		throw new Error('Database not initialized. Call connectDb() first.');
	}

	return db.collection<Favorite>('favorites');
}
