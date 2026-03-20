import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(MONGODB_URI);
const connectPromise = client.connect();

export async function getDb() {
	await connectPromise;
	return client.db('production');
}
