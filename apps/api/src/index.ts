import cors from '@fastify/cors';
import Fastify from 'fastify';

import { connectDb } from './db.js';
import { favoritesRoutes } from './routes/favorites.js';

const app = Fastify({
	logger: {
		transport: {
			options: {
				colorize: true,
				ignore: 'pid,hostname',
				translateTime: 'HH:MM:ss',
			},
			target: 'pino-pretty',
		},
	},
});

const PORT = Number(process.env.API_PORT) || 49026;
const HOST = process.env.API_HOST || '0.0.0.0';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:49025';

async function start() {
	try {
		await app.register(cors, {
			methods: ['GET', 'POST', 'DELETE'],
			origin: FRONTEND_URL,
		});

		app.get('/health', async () => {
			return {
				status: 'ok',
				timestamp: new Date().toISOString(),
			};
		});

		await connectDb();
		app.log.info('Connected to MongoDB');

		await app.register(favoritesRoutes);

		await app.listen({
			host: HOST,
			port: PORT,
		});

		app.log.info(`API server running at http://${HOST}:${PORT}`);
	}
	catch (error) {
		app.log.error(error);
		process.exit(1);
	}
}

start();
