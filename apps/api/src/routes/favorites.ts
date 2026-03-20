import { Dates } from '@tmlmobilidade/utils';
import { FastifyInstance } from 'fastify';
import { getDb } from '../db/connection.js';
import { FavoriteDocument } from '@/types/favorite.js';

const postSchema = {
	body: {
		properties: {
			line_id: { minLength: 1, type: 'string' },
		},
		required: ['line_id'],
		type: 'object',
	},
} as const;

const deleteSchema = {
	params: {
		properties: {
			line_id: { minLength: 1, type: 'string' },
		},
		required: ['line_id'],
		type: 'object',
	},
} as const;

export default async function favoritesRoutes(app: FastifyInstance) {
	const db = await getDb();
	const collection = db.collection<FavoriteDocument>('favorites');

	app.get('/favorites', async () => {
		return collection.find().toArray();
	});
	app.post<{ Body: { line_id: string } }>('/favorites', { schema: postSchema }, async (request, reply) => {
		const { line_id } = request.body;

		const existing = await collection.findOne({ line_id });
		if (existing) {
			return reply.status(409).send({ error: 'Linha ja existe nos favoritos' });
		}

		const now = Dates.now('utc');
		const doc: FavoriteDocument = {
			createdAt: now.unix_timestamp,
			line_id,
			operationalDate: now.operational_date,
		};

		await collection.insertOne(doc);
		return reply.status(201).send(doc);
	});

	app.delete<{ Params: { line_id: string } }>('/favorites/:line_id', { schema: deleteSchema }, async (request, reply) => {
		const { line_id } = request.params;

		const result = await collection.deleteOne({ line_id });
		if (result.deletedCount === 0) {
			return reply.status(404).send({ error: 'Favorito nao encontrado' });
		}

		return reply.status(204).send();
	});
}
