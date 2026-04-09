import mongoose from 'mongoose'
import { Dates } from '@tmlmobilidade/utils'

// The model itself to regulate the storage of favorites by the app
const favoriteSchema = new mongoose.Schema({
  lineId: { type: String, required: true, unique: true }, // The only thing I'll send by the app
  createdAt: { type: Number, required: true }, // Both dates need to be setted by this code t be required but not passed by the app
  operationalDate: { type: String, required: true },
})

// setting the dates before the save itself
favoriteSchema.pre('save', function () {
  const now = Dates.now('Europe/Lisbon')
  this.createdAt = now.unix_timestamp
  this.operationalDate = now.operational_date
})

// finally exporting the model to be used by the app
export const Favorite = mongoose.model('Favorite', favoriteSchema)
