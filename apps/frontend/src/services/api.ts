const API_URL = 'http://localhost:3001/favorites' 

export async function getFavorites() {
  const res = await fetch(API_URL, { cache: 'no-store' }) // evita cache
  if (!res.ok) throw new Error('Failed to fetch favorites')
  return res.json()
}

export async function addFavorite(lineId: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lineId }),
  })
  if (!res.ok) throw new Error('Failed to add favorite')
  return res.json()
}

export async function removeFavorite(lineId: string) {
  const res = await fetch(`${API_URL}/${lineId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to remove favorite')
  return res.json()
}




