import mongoose from 'mongoose'
import { Dates } from '@tmlmobilidade/utils'

// The model itself to regulate the storage of favorites by the app
const favoriteSchema = new mongoose.Schema({
  lineId: { type: String, required: true, unique: true }, // The only thing I'll send by the app
  createdAt: { type: Number, required: true }, // Both dates need to be setted by this code
  operationalDate: { type: String, required: true },
})