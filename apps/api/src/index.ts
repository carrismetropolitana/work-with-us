/* * */

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import mongoose from 'mongoose';

/* * */

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

/* * */

// Register plugins
await app.register(cors, {
	credentials: true,
	origin: true,
});

await app.register(cookie);

/* * */

// Health check route
app.get('/health', async () => {
	return { status: 'ok', timestamp: new Date().toISOString() };
});

/* * */

// Start server
const PORT = Number(process.env.API_PORT) || 5050;
const HOST = process.env.API_HOST || '0.0.0.0';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carris-favorites';

try {
	// Connect to MongoDB
	await mongoose.connect(MONGODB_URI);
	app.log.info('📦 Connected to MongoDB');

	// Start Fastify server
	await app.listen({ host: HOST, port: PORT });
	app.log.info(`🚀 API Server running at http://${HOST}:${PORT}`);
}
catch (error) {
	app.log.error(error);
	process.exit(1);
}
