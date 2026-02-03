/* * */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { database } from './db.js';
import { linesRoutes } from './routes/lines.js';
import { favoritesRoutes } from './routes/favorites.js';

/* * */

/**
 * Main Fastify Server
 */

async function start() {
    // Create Fastify instance with pretty logging
    const fastify = Fastify({
        logger: {
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    colorize: true
                }
            }
        }
    });

    try {
        // Register plugins
        await fastify.register(cors, {
            origin: process.env.FRONTEND_URL || 'http://localhost:49025',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        });

        await fastify.register(cookie);

        // Connect to MongoDB
        await database.connect();

        // Register routes
        await fastify.register(linesRoutes);
        await fastify.register(favoritesRoutes);

        // Health check endpoint
        fastify.get('/health', async () => {
            return {
                status: 'ok',
                mongodb: database.isConnected(),
                timestamp: new Date().toISOString()
            };
        });

        // Start server
        const port = parseInt(process.env.API_PORT || '3001', 10);
        const host = process.env.API_HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log('');
        console.log('🚀 API Server is running!');
        console.log(`📍 URL: http://localhost:${port}`);
        console.log(`🗄️  MongoDB: ${database.isConnected() ? 'Connected' : 'Disconnected'}`);
        console.log('');

    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach(signal => {
        process.on(signal, async () => {
            console.log(`\n${signal} received, closing gracefully...`);
            await database.close();
            await fastify.close();
            process.exit(0);
        });
    });
}

/* * */

start();
