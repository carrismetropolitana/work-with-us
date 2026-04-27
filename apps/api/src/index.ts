import cors from '@fastify/cors';
import Fastify from 'fastify';

import { config } from './config.js';
import { connectMongo, disconnectMongo } from './db/mongo.js';
import { favoritesRoutes } from './routes/favorites.js';

async function main(): Promise<void> {
	const app = Fastify({
		logger: {
			transport: { options: { ignore: 'pid,hostname', translateTime: 'HH:MM:ss' }, target: 'pino-pretty' },
		},
	});

	await app.register(cors, {
		methods: ['GET', 'POST', 'DELETE'],
		origin: config.cors_origin,
	});

	await connectMongo();

	app.get('/health', async () => ({ status: 'ok' }));
	await app.register(favoritesRoutes);

	const shutdown = async (signal: string): Promise<void> => {
		app.log.info(`Received ${signal}, shutting down`);
		await app.close();
		await disconnectMongo();
		process.exit(0);
	};
	process.on('SIGINT', () => void shutdown('SIGINT'));
	process.on('SIGTERM', () => void shutdown('SIGTERM'));

	await app.listen({ host: '0.0.0.0', port: config.port });
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
