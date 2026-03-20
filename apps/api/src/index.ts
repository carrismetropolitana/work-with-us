import cors from '@fastify/cors';
import fastify from 'fastify';
import favoritesRoutes from './routes/favorites.js';
import { getDb } from './db/connection.js';

const app = fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
		},
	},
});

const PORT = Number(process.env.API_PORT) || 49026;

async function start() {
	await app.register(cors, {
		methods: ['GET', 'POST', 'DELETE'],
		origin: 'http://localhost:49025',
	});

	await app.register(favoritesRoutes);
	const db = await getDb();
	await db.collection('favorites').createIndex({ line_id: 1 }, { unique: true });
	await app.listen({ host: '0.0.0.0', port: PORT });
}

start().catch((err) => {
	app.log.error(err);
	process.exit(1);
});
