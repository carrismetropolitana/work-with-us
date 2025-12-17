import mongoose from 'mongoose'

export async function connectDB() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://root:root@localhost:37001/production?authSource=admin'
  await mongoose.connect(mongoUrl)
}



