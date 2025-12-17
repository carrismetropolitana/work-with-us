import { FastifyInstance } from 'fastify'
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorites.controller.js'

export default async function favoritesRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return getFavorites()  // Certifique-se que retorna a Promise
  })

  app.post('/', async (request, reply) => {
    const { lineId } = request.body as { lineId?: string }
    if (!lineId) return reply.status(400).send({ error: 'lineId is required' })

    const favorite = await addFavorite(lineId)
    return reply.status(201).send(favorite)
  })

  app.delete('/:lineId', async (request, reply) => {
    const { lineId } = request.params as { lineId: string }
    await removeFavorite(lineId)
    return reply.status(200).send({ success: true })
  })
}




