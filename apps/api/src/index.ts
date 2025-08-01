import cors from '@fastify/cors';
import Fastify from 'fastify';

import favoritesRoute from './routes/favorites.js';
import { connectDB } from './utils/db.js';

const app = Fastify();

await app.register(cors, {
	methods: ['GET', 'POST', 'DELETE'],
	origin: true,
});

await connectDB();

await app.register(favoritesRoute, { prefix: '/api/favorites' });

const PORT = Number(process.env.PORT) || 4000;
app.listen({ port: PORT }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`🚀 API listening at ${address}`);
});
