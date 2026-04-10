import { FastifyInstance } from 'fastify'
import { Favorite } from '../models/favorite.model.js' // I kwno Lucas it's a bit weird without the '.ts' but it's the way to do it with TypeScript
import { Dates } from '@tmlmobilidade/utils' // The date will be setted by the app not the db anymore

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
            const now = Dates.now("Europe/Lisbon") // from utils to set the favorite data
            const newFavorite = new Favorite({ 
                lineId,
                createdAt: now.unix_timestamp,
                operationalDate: now.operational_date, 
            })
            
            await newFavorite.save()
            reply.status(201).send(newFavorite)
        } catch (error) {
            console.error('Error creating favorite:', error)
            return reply.status(500).send({ message: `Error creating favorite: ${error.message}` })
        }
    })

    // DELETEs
    // DELETE a favorite
    app.delete('/favorites/:lineId', async (request, reply) => {
        const { lineId } = request.params as { lineId: string }

        if (!lineId) {
            reply.status(400).send({ message: 'lineId is required' })
        }

        try {
            const deletedFavorite = await Favorite.findOneAndDelete({ lineId })
            if (!deletedFavorite) { // Could not find in DB, 404 surely if could connect to DB it will be caught by the catch block
                reply.status(404).send({ message: 'Favorite not found' })
            } else {
                reply.status(204).send({ message: 'Favorite deleted successfully' })
            }
        } catch (error) { // Could not connect to DB or other error
            reply.status(500).send({ message: 'Error deleting favorite' })
        }
    })
}