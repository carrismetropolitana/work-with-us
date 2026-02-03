'use client';

import type { Line } from '../lib/api';
import { FavoriteButton } from './FavoriteButton';
import styles from '../styles/page.module.css';

/* * */

interface LineCardProps {
    line: Line;
    isFavorite: boolean;
    onToggleFavorite: (lineId: string, isFavorite: boolean) => Promise<void>;
}

/**
 * Line Card Component
 * 
 * Displays individual line information with:
 * - Line number and name
 * - Color-coded design
 * - Favorite toggle button
 * - Click to open CM website
 * - Hover effects
 */
export function LineCard({ line, isFavorite, onToggleFavorite }: LineCardProps) {
    const handleCardClick = () => {
        const url = `https://carrismetropolitana.pt/lines/${line.id}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={styles.lineCard}
            onClick={handleCardClick}
            style={{
                borderLeftColor: `#${line.color}`,
            }}
        >
            <div className={styles.lineCardHeader}>
                <div
                    className={styles.lineNumber}
                    style={{
                        backgroundColor: line.color || '#667eea',
                        color: line.text_color || '#FFFFFF',
                    }}
                >
                    {line.short_name}
                </div>
                <div className={styles.favoriteButtonWrapper}>
                    <FavoriteButton
                        lineId={line.id}
                        isFavorite={isFavorite}
                        onToggle={onToggleFavorite}
                    />
                </div>
            </div>

            <div className={styles.lineCardBody}>
                <h3 className={styles.lineName}>{line.long_name}</h3>
                {line.municipalities && line.municipalities.length > 0 && (
                    <p className={styles.lineMunicipalities}>
                        {line.municipalities.join(' • ')}
                    </p>
                )}
            </div>
        </div>
    );
}
