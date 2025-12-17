import mongoose, { Schema } from 'mongoose'

interface IFavorite {
  lineId: string
  createdAtUnix: number
  operationalDate: string
}

const FavoriteSchema = new Schema<IFavorite>({
  lineId: { type: String, required: true },
  createdAtUnix: { type: Number, required: true },
  operationalDate: { type: String, required: true }
})

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema)

