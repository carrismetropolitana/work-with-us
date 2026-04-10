import Fastify from 'fastify'
import mongoose from 'mongoose'
import { favoritesRoutes } from './routes/favorites.routes'
import cors from '@fastify/cors'

/* * */

// Check for required environment variables before starting the server
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined')
}

if (!process.env.PORT) {
  throw new Error('PORT is not defined')
}

/* * */

// Create Fastify instance
const app = Fastify()

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Debug: Connected to MongoDB') // Debug log for successful connection

    app.register(favoritesRoutes) // Connect API routes
    console.log('Debug: API routes registered') // Debug log for successful route registration

    await app.register(cors, { // Enable the funcction of CRUD by the frontend
      origin: '*'
    })

    app.listen({ port: Number(process.env.PORT) }, (err) => {
      if (err) throw err
      console.log(`Debug: Server running on port ${process.env.PORT}`)
    })
  })

  .catch((err) => {
    throw new Error(`Failed to connect to MongoDB: ${err}`) // Error handling for MongoDB connection failure cause its called only if the error is before the app.listen()
  })