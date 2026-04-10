'use client'

import type { EnrichedLine } from '../lib/carris'

interface LineCardProps {
    line: EnrichedLine
    isFavorite: boolean
    onToggleFavorite: (lineId: string) => void
}

export default function LineCard({ line, isFavorite, onToggleFavorite }: LineCardProps) {
    return (
        <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>

            {/* Main card */}
            <div style={{ flex: 1, backgroundColor: '#4a4a4a', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Firstline/Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                        backgroundColor: line.color,
                        color: line.text_color,
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                    }}>
                        {line.id}
                    </span>
                    <button onClick={() => onToggleFavorite(line.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
            
                {/* Line name */}
                <div style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold', lineHeight: 1.2 }}> {/* White to be easier to read, but I did want line.text_color */}
                    {line.tts_name}
                </div>
            </div>
        </div>
    )
}