import mongoose from 'mongoose'

// The model itself to regulate the storage of favorites by the app
const favoriteSchema = new mongoose.Schema({
  lineId: { type: String, required: true, unique: true },
  createdAt: { type: Number, required: true }, 
  operationalDate: { type: String, required: true },
})

// finally exporting the model to be used by the app
export const Favorite = mongoose.model('Favorite', favoriteSchema)
