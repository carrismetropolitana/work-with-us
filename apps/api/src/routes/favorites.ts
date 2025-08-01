import Favorite from '@/models/Favorite.js';
import { Dates } from '@tmlmobilidade/utils';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const favoritesRoute: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.get('/', async (req, res) => {
		const favorites = await Favorite.find().select('lineId createdAt operationalDate -_id');
		res.send(favorites);
	});

	app.post('/', async (req, res) => {
		const { lineId } = req.body as { lineId?: string };

		if (!lineId) {
			res.status(400).send({ error: 'Missing lineId' });
			return;
		}

		try {
			const now = new Date();
			const operationalDate = Dates.fromJSDate(now).operational_date;

			const favorite = await Favorite.create({
				createdAt: Math.floor(now.getTime() / 1000),
				lineId,
				operationalDate,
			});

			res.status(201).send(favorite);
		}
		catch (e) {
			console.error(e);
			res.status(409).send({ error: 'Already favorited or failed' });
		}
	});

	app.delete('/:lineId', async (req, res) => {
		const { lineId } = req.params as { lineId: string };

		if (!lineId) {
			res.status(400).send({ error: 'Missing lineId' });
			return;
		}

		await Favorite.deleteOne({ lineId });
		res.send({ success: true });
	});
};

export default favoritesRoute;
