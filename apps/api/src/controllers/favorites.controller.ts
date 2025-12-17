import { Favorite } from '../models/favorite.model.js'

export async function getFavorites() {
  return Favorite.find()
}

export async function addFavorite(lineId: string) {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const operationalDateString = `${yyyy}${mm}${dd}`

  return Favorite.create({
    lineId,
    createdAtUnix: Date.now(),
    operationalDate: operationalDateString
  })
}

export async function removeFavorite(lineId: string) {
  return Favorite.deleteOne({ lineId })
}



