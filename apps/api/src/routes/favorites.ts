import { Dates } from '@tmlmobilidade/utils';
import { FastifyInstance } from 'fastify';

import { getFavoritesCollection } from '../db.js';

interface CreateFavoriteBody {
	lineId: string
}

export async function favoritesRoutes(app: FastifyInstance) {
	app.get('/favorites', async () => {
		const favoritesCollection = getFavoritesCollection();
		const favorites = await favoritesCollection
			.find()
			.sort({ createdAt: -1 })
			.toArray();

		return favorites;
	});

	app.post<{ Body: CreateFavoriteBody }>(
		'/favorites',
		async (request, reply) => {
			const lineId = request.body?.lineId?.trim();

			if (!lineId) {
				return reply.status(400).send({
					error: 'lineId is required',
				});
			}

			const favoritesCollection = getFavoritesCollection();

			const existingFavorite = await favoritesCollection.findOne({ lineId });

			if (existingFavorite) {
				return reply.status(200).send(existingFavorite);
			}

			const datesNow = Dates.now('Europe/Lisbon');

			const favorite = {
				createdAt: datesNow.unix_timestamp,
				lineId,
				operationalDate: datesNow.operational_date,
			};

			await favoritesCollection.insertOne(favorite);

			return reply.status(201).send(favorite);
		},
	);

	app.delete<{ Params: { lineId: string } }>(
		'/favorites/:lineId',
		async (request, reply) => {
			const { lineId } = request.params;

			const favoritesCollection = getFavoritesCollection();
			const result = await favoritesCollection.deleteOne({ lineId });

			if (result.deletedCount === 0) {
				return reply.status(404).send({
					error: 'Favorite not found',
				});
			}

			return reply.status(204).send();
		},
	);
}
