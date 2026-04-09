import Fastify from 'fastify'
import mongoose from 'mongoose'
import { favoritesRoutes } from './routes/favorites.routes'

/* * */

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined')
}

if (!process.env.PORT) {
  throw new Error('PORT is not defined')
}