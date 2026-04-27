import type { Favorite } from '../types.js';
import type { FastifyInstance } from 'fastify';

import { Dates } from '@tmlmobilidade/utils';

import { config } from '../config.js';
import { favoritesCollection } from '../db/mongo.js';

export async function favoritesRoutes(app: FastifyInstance): Promise<void> {
	app.get('/favorites', async () => {
		const docs = await favoritesCollection()
			.find({}, { projection: { _id: 0 } })
			.sort({ created_at: -1 })
			.toArray();
		return docs;
	});

	app.post<{ Body: { line_id?: unknown } }>('/favorites', async (request, reply) => {
		const line_id = request.body?.line_id;
		if (typeof line_id !== 'string' || line_id.trim() === '') {
			return reply.code(400).send({ error: 'line_id is required and must be a non-empty string' });
		}

		const now = Dates.now(config.timezone);
		const favorite: Favorite = {
			created_at: now.unix_timestamp,
			line_id,
			operational_date: now.operational_date,
		};

		// Idempotent: if it already exists, keep the original created_at/operational_date
		// and just return it. Otherwise insert. The unique index on line_id guarantees
		// a single document per line.
		await favoritesCollection().updateOne(
			{ line_id },
			{ $setOnInsert: favorite },
			{ upsert: true },
		);

		const stored = await favoritesCollection().findOne({ line_id }, { projection: { _id: 0 } });
		return reply.code(201).send(stored);
	});

	app.delete<{ Params: { line_id: string } }>('/favorites/:line_id', async (request, reply) => {
		const { line_id } = request.params;
		const result = await favoritesCollection().deleteOne({ line_id });
		if (result.deletedCount === 0) {
			return reply.code(404).send({ error: 'favorite not found' });
		}
		return reply.code(204).send();
	});
}
