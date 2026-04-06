import { Dates } from '@tmlmobilidade/utils';
import cors from 'cors';
import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI as string;

const client = new MongoClient(MONGO_URI);

let favoritesCollection: any;

async function start() {
	try {
		await client.connect();
		console.log('Mongo connected');

		const db = client.db(process.env.MONGO_INITDB_DATABASE);
		favoritesCollection = db.collection('favorites');

		app.listen(3001, () => {
			console.log('API server running on 3001');
		});
	}
	catch (err) {
		console.error('Mongo connection failed', err);
	}
}

start();

app.get('/api/favorites', async (req, res) => {
	try {
		const favorites = await favoritesCollection.find().toArray();
		res.json(favorites);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch favorites' });
	}
});

app.post('/api/favorites', async (req, res) => {
	const { lineId, longName, shortName } = req.body;

	if (!lineId || !longName || !shortName) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const existing = await favoritesCollection.findOne({ lineId });

		if (existing) {
			return res.status(400).json({ error: 'Favorite already exists' });
		}

		const result = await favoritesCollection.insertOne({
			createdAt: Dates.now('Europe/Lisbon').unix_timestamp,
			lineId,
			longName,
			shortName,
		});

		res.status(201).json({
			createdAt: result.createdAt,
			id: result.insertedId,
			lineId,
			longName,
			shortName,
		});
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to add favorite' });
	}
});

app.delete('/api/favorites/:lineId', async (req, res) => {
	const { lineId } = req.params;

	try {
		const result = await favoritesCollection.deleteOne({ lineId });

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: 'Favorite not found' });
		}

		res.json({ message: 'Favorite deleted' });
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete favorite' });
	}
});
