'use client'

import { useState } from 'react'
import { Button } from '@tmlmobilidade/ui'
import LineCard from './LineCard'
import type { EnrichedLine } from '../lib/carris'
import { addFavorite, removeFavorite } from '../lib/favorite'

interface LinesGridProps {
    lines: EnrichedLine[]
    initialFavorites: string[]
}

export default function LinesGrid({ lines, initialFavorites }: LinesGridProps) {
    const [favorites, setFavorites] = useState<string[]>(initialFavorites)
    const [filter, setFilter] = useState<'all' | 'favorites'>('all')

    const visibleLines = filter === 'favorites' ? lines.filter(l => favorites.includes(l.id)) : lines

    async function handleToggleFavorite(lineId: string) {
        if (favorites.includes(lineId)) {
            await removeFavorite(lineId)
            setFavorites(prev => prev.filter(id => id !== lineId))
        } else {
            await addFavorite(lineId)
            setFavorites(prev => [...prev, lineId])
        }
    }

    return (
        <div>
            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    label="Todas as Linhas"
                    onClick={() => setFilter('all')}
                />
                <Button
                    label="Favoritas ❤️"
                    onClick={() => setFilter('favorites')}
                />
            </div>

            {/* Grid | A map as the main page is/was */} 
            <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))'
            }}>
                {visibleLines.map(line => (
                    <LineCard
                    key={line.id}
                    line={line}
                    isFavorite={favorites.includes(line.id)}
                    onToggleFavorite={handleToggleFavorite}
                />
                ))}
            </div>

            {filter === 'favorites' && visibleLines.length === 0 && (
                <p style={{ color: '#888', marginTop: '40px', textAlign: 'center' }}>
                    Ainda não tens linhas favoritas!
                </p>
            )}
        </div>
    )
}