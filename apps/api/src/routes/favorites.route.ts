import { FastifyInstance } from 'fastify'
import { Favorite } from '../models/favorite.model'

export async function favoritesRoutes(app: FastifyInstance) {
    // GET all favorites
    app.get('/favorites', async (request, reply) => {
        const favorites = await Favorite.find()
        reply.send(favorites)
    })
    // GET a specific one
    app.get('/favorites/:lineId', async (request, reply) => {
        const { lineId } = request.params as { lineId: string }
        const favorite = await Favorite.findOne({ lineId })

        if (!favorite) {
            reply.status(404).send({ message: 'Favorite not found or do not exist' })
        }

        reply.send(favorite)
    })
} 