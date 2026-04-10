import { FastifyInstance } from 'fastify'
import { Favorite } from '../models/favorite.model.js' // I kwno Lucas it's a bit weird without the '.ts' but it's the way to do it with TypeScript
import { Dates } from '@tmlmobilidade/utils' // The date will be setted by the app not the db anymore

export async function favoritesRoutes(app: FastifyInstance) {
    // GETs
    // GET all favorites
    app.get('/favorites', async (request, reply) => {
        const favorites = await Favorite.find() // find is a built-in method from mongoose to get all favorites from a DB
        let visibleFavorites = favorites.map(favorite => ({
            lineId: favorite.lineId,
            createdAt: favorite.createdAt,
            createdAtHumanReadable: new Date(favorite.createdAt).toISOString(), // converting the unix timestamp to a human-readable date format
            operationalDate: favorite.operationalDate,
        })) // mapping the favorites to only send the data that I want to send to the app, without the db id and other stuff that I don't want to send
        
        return reply.send(visibleFavorites)
    })
    // GET a specific one
    app.get('/favorites/:lineId', async (request, reply) => {
        const { lineId } = request.params as { lineId: string }
        const favorite = await Favorite.findOne({ lineId }) // findOne is a built-in method from mongoose to get all favorites from a DB

        if (!favorite) {
            reply.status(404).send({ message: 'Favorite not found or do not exist' })
        }
        
        const visibleFavorite = {
            lineId: favorite.lineId, // only this id, without the db id
            createdAt: favorite.createdAt, // the unix timestamp to be used in any future filter/features
            createdAtHumanReadable: new Date(favorite.createdAt).toISOString(), // converting the unix timestamp to a human-readable date format
            operationalDate: favorite.operationalDate,
        } 
        return reply.send(visibleFavorite)
    })

    // POSTs
    // POST a new favorite
    app.post('/favorites', async (request, reply) => {
        const { lineId } = request.body as { lineId: string }
        
        if (!lineId) {
            return reply.status(400).send({ message: 'lineId is required' })
        }

        try {
            const now = Dates.now("Europe/Lisbon") // from utils to set the favorite data
            const newFavorite = new Favorite({ 
                lineId,
                createdAt: now.unix_timestamp,
                operationalDate: now.operational_date, 
            }) // with the obj in memeory I can send it in ddebugs and other stuff before saving it to the DB

            await newFavorite.save()
            return reply.status(201).send({ message: 'Favorite created successfully', favorite: {
                lineId: newFavorite.lineId,
                createdAt: newFavorite.createdAt,
                createdAtHumanReadable: new Date(newFavorite.createdAt).toISOString(),
                operationalDate: newFavorite.operationalDate,
            } })
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
            return reply.status(400).send({ message: 'lineId is required' })
        }

        try {
            const deletedFavorite = await Favorite.findOneAndDelete({ lineId })
            
            if (!deletedFavorite) { // Could not find in DB, 404 surely if could connect to DB it will be caught by the catch block
                return reply.status(404).send({ message: 'Favorite not found' })
            }

            return reply.status(200).send({ message: 'Favorite deleted successfully' })
        } catch (error) { // Could not connect to DB or other error
            return reply.status(500).send({ message: 'Error deleting favorite' })
        }
    })
}