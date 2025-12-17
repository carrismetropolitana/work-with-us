import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'

import { connectDB } from './db/connection.js'
import favoritesRoutes from './routes/favorites.routes.js'

const app = Fastify({ logger: true })

// Registar CORS
await app.register(cors, {
  origin: true,   // permite qualquer origem
  methods: ['GET','POST','DELETE','PUT','OPTIONS'],
})

// Conectar DB
try {
  await connectDB()
  console.log('MongoDB connected')
} catch (err) {
  console.error('MongoDB connection error:', err)
  process.exit(1)
}

// Registrar rotas
app.register(favoritesRoutes, { prefix: '/favorites' })

// Start server
const PORT = Number(process.env.PORT) || 3001
app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`API running on ${address}`)
})





