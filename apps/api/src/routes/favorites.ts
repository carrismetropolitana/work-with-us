/* * */

import type { FastifyInstance } from 'fastify';
import { Dates } from '@tmlmobilidade/utils';
import { database } from '../db.js';
import type { Favorite } from '../types.js';

/* * */

/**
 * Favorites Routes
 * 
 * Manages user favorites with MongoDB persistence.
 * - createdAtUnix: Unix timestamp (using TML Dates utility)
 * - createdAtOperationalDate: Operational date (using TML Dates utility)
 */

export async function favoritesRoutes(fastify: FastifyInstance) {
    /**
     * GET /api/favorites
     * Retrieve all favorite lines
     */
    fastify.get('/api/favorites', async (request, reply) => {
        try {
            const collection = database.getFavoritesCollection();
            const favorites = await collection.find({}).toArray();

            fastify.log.info(`Retrieved ${favorites.length} favorites`);
            return { success: true, data: favorites };

        } catch (error) {
            fastify.log.error('Error fetching favorites:', error);
            reply.status(500);
            return {
                success: false,
                error: 'Failed to fetch favorites'
            };
        }
    });

    /**
     * POST /api/favorites
     * Add a line to favorites
     * 
     * Body: { lineId: string }
     */
    fastify.post<{ Body: { lineId: string } }>('/api/favorites', async (request, reply) => {
        try {
            const { lineId } = request.body;

            if (!lineId) {
                reply.status(400);
                return {
                    success: false,
                    error: 'lineId is required'
                };
            }

            // Create a Dates instance for current time in UTC
            const now = Dates.now('utc');

            // Get Unix timestamp (in milliseconds) and Operational Date
            const createdAtUnix = now.unix_timestamp;
            const createdAtOperationalDate = now.operational_date;

            const favorite: Favorite = {
                lineId,
                createdAtUnix,
                createdAtOperationalDate
            };

            const collection = database.getFavoritesCollection();

            // Insert with duplicate check (unique index on lineId)
            try {
                const result = await collection.insertOne(favorite);
                fastify.log.info(`Added favorite: ${lineId} (Unix: ${createdAtUnix}, OpDate: ${createdAtOperationalDate})`);

                return {
                    success: true,
                    data: { ...favorite, _id: result.insertedId.toString() }
                };
            } catch (insertError: any) {
                // Duplicate key error (code 11000)
                if (insertError.code === 11000) {
                    reply.status(409);
                    return {
                        success: false,
                        error: 'Line is already in favorites'
                    };
                }
                throw insertError;
            }

        } catch (error) {
            fastify.log.error('Error adding favorite:', error);
            reply.status(500);
            return {
                success: false,
                error: 'Failed to add favorite'
            };
        }
    });

    /**
     * DELETE /api/favorites/:lineId
     * Remove a line from favorites
     */
    fastify.delete<{ Params: { lineId: string } }>('/api/favorites/:lineId', async (request, reply) => {
        try {
            const { lineId } = request.params;

            const collection = database.getFavoritesCollection();
            const result = await collection.deleteOne({ lineId });

            if (result.deletedCount === 0) {
                reply.status(404);
                return {
                    success: false,
                    error: 'Favorite not found'
                };
            }

            fastify.log.info(`Removed favorite: ${lineId}`);
            return { success: true, data: { lineId } };

        } catch (error) {
            fastify.log.error('Error removing favorite:', error);
            reply.status(500);
            return {
                success: false,
                error: 'Failed to remove favorite'
            };
        }
    });
}
