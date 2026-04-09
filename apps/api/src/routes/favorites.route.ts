import { FastifyInstance } from 'fastify'
import { Favorite } from '../models/favorite.model'

export async function favoritesRoutes(app: FastifyInstance) {
    // GETs
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

    // POSTs
    // POST a new favorite
    app.post('/favorites', async (request, reply) => {
        const { lineId } = request.body as { lineId: string }
        
        if (!lineId) {
            reply.status(400).send({ message: 'lineId is required' })
        }

        try {
            const newFavorite = new Favorite({ lineId })
            await newFavorite.save()
            reply.status(201).send(newFavorite)
        } catch (error) {
            reply.status(500).send({ message: 'Error creating favorite' })
        }
    })
}