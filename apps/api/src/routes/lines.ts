/* * */

import type { FastifyInstance } from 'fastify';
import type { Line } from '../types.js';

/* * */

/**
 * Lines Routes
 * 
 * Proxies requests to the Carris Metropolitana public API.
 * Implements caching to reduce external API calls.
 */

// Simple in-memory cache
let linesCache: Line[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function linesRoutes(fastify: FastifyInstance) {
    /**
     * GET /api/lines
     * Fetch all lines from Carris Metropolitana API
     */
    fastify.get('/api/lines', async (request, reply) => {
        try {
            // Check cache
            const now = Date.now();
            if (linesCache && (now - cacheTimestamp) < CACHE_DURATION) {
                fastify.log.info('Returning cached lines data');
                return { success: true, data: linesCache };
            }

            // Fetch from external API
            fastify.log.info('Fetching lines from Carris Metropolitana API');
            const response = await fetch('https://api.carrismetropolitana.pt/v2/lines');

            if (!response.ok) {
                throw new Error(`External API returned ${response.status}`);
            }

            const lines: Line[] = await response.json() as Line[];

            // Update cache
            linesCache = lines;
            cacheTimestamp = now;

            fastify.log.info(`Fetched ${lines.length} lines successfully`);
            return { success: true, data: lines };

        } catch (error) {
            fastify.log.error('Error fetching lines:', error);
            reply.status(500);
            return {
                success: false,
                error: 'Failed to fetch lines from Carris Metropolitana API'
            };
        }
    });
}
