const API_URL = process.env.NEXT_PUBLIC_API_URL


// Internarl request to CRUD favrites, which will be used in the LineCard component to toggle favorites
export async function getFavorites() {
    const response = await fetch(`${API_URL}/favorites`)
    
    if (!response.ok) throw new Error('Failed to fetch favorites')
    
        return response.json()
}

export async function addFavorite(lineId: string) {
    const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
    })
    
    if (!response.ok) throw new Error('Failed to add favorite')
    
    return response.json()
}

export async function removeFavorite(lineId: string) {
    const response = await fetch(`${API_URL}/favorites/${lineId}`, {
        method: 'DELETE',
    })
    
    if (!response.ok) throw new Error('Failed to remove favorite')
    
    return response.json()
}