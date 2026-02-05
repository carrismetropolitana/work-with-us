/* * */

import { Dates } from '@tmlmobilidade/utils';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { Favorite } from '../models/Favorite.js';

/* * */

interface AddFavoriteBody {
	line_id: string
}

interface DeleteFavoriteParams {
	line_id: string
}

/* * */

export async function favoritesRoutes(app: FastifyInstance) {
	// GET /favorites - Listar todos os favoritos
	app.get('/favorites', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const favorites = await Favorite.find().sort({ created_at_unix: -1 });
			return reply.status(200).send(favorites);
		}
		catch (error) {
			app.log.error(error);
			return reply.status(500).send({ error: 'Failed to fetch favorites' });
		}
	});

	/* * */

	// POST /favorites - Adicionar um favorito
	app.post<{ Body: AddFavoriteBody }>('/favorites', async (request, reply) => {
		try {
			const { line_id } = request.body;

			if (!line_id) {
				return reply.status(400).send({ error: 'line_id is required' });
			}

			// Verificar se já existe
			const exists = await Favorite.findOne({ line_id });
			if (exists) {
				return reply.status(409).send({ error: 'Favorite already exists' });
			}

			// Criar favorito com datas usando @tmlmobilidade/utils
			const datesNow = Dates.now('Europe/Lisbon');
			const favorite = await Favorite.create({
				created_at_operational_date: datesNow.operational_date,
				created_at_unix: Math.floor(datesNow.unix_timestamp / 1000),
				line_id,
			});

			return reply.status(201).send(favorite);
		}
		catch (error) {
			app.log.error(error);
			return reply.status(500).send({ error: 'Failed to create favorite' });
		}
	});

	/* * */

	// DELETE /favorites/:line_id - Remover um favorito
	app.delete<{ Params: DeleteFavoriteParams }>('/favorites/:line_id', async (request, reply) => {
		try {
			const { line_id } = request.params;

			const result = await Favorite.findOneAndDelete({ line_id });

			if (!result) {
				return reply.status(404).send({ error: 'Favorite not found' });
			}

			return reply.status(200).send({ message: 'Favorite deleted successfully' });
		}
		catch (error) {
			app.log.error(error);
			return reply.status(500).send({ error: 'Failed to delete favorite' });
		}
	});
}
