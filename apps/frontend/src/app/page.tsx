'use client'

import { useEffect, useState } from 'react'
import { Button } from '@tmlmobilidade/ui'
import { getLines } from '../services/lines'
import { getFavorites, addFavorite, removeFavorite } from '../services/api'

export default function Page() {
  const [lines, setLines] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  async function loadLines() {
    const data = await getLines()
    setLines(data)
  }

  async function loadFavorites() {
    const favs = await getFavorites()
    // Garante que é array de lineId
    setFavorites(favs.map((f: any) => f.lineId))
  }

  useEffect(() => {
    loadLines()
    loadFavorites()
  }, [])

  function isFavorite(lineId: string) {
    return favorites.includes(lineId)
  }

  async function toggleFavorite(lineId: string) {
    if (isFavorite(lineId)) {
      await removeFavorite(lineId)
    } else {
      await addFavorite(lineId)
    }
    await loadFavorites()
  }

  return (
    <div className="p-4">
      <h1>LINES</h1>
      <ul>
        {lines.map(line => (
          <li key={line.id} className="mb-2">
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline', marginRight: 10 }}
              onClick={() => window.open(`https://www.carrismetropolitana.pt/pt/linha/${line.id}`, '_blank')}
            >
              {line.name}
            </span>
            <Button
              label={isFavorite(line.id) ? 'UNFAVORITE' : 'FAVORITE'}
              onClick={() => toggleFavorite(line.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
