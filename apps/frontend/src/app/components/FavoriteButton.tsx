'use client';

import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { Button } from '@tmlmobilidade/ui';
import { useState, useEffect } from 'react';

/* * */

interface FavoriteButtonProps {
    lineId: string;
    isFavorite: boolean;
    onToggle: (lineId: string, isFavorite: boolean) => Promise<void>;
}

/**
 * Favorite Toggle Button Component
 * 
 * Features:
 * - Heart icon that fills when favorited
 * - Optimistic UI updates
 * - Error handling with rollback
 * - Loading state during API calls
 */
export function FavoriteButton({ lineId, isFavorite, onToggle }: FavoriteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

    // Sync local state with prop (e.g. when SWR updates)
    useEffect(() => {
        setLocalIsFavorite(isFavorite);
    }, [isFavorite]);

    const handleClick = async () => {
        // Optimistic update
        const previousState = localIsFavorite;
        setLocalIsFavorite(!localIsFavorite);
        setIsLoading(true);

        try {
            await onToggle(lineId, !localIsFavorite);
        } catch (error) {
            // Rollback on error
            setLocalIsFavorite(previousState);
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Button
                icon={localIsFavorite ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                onClick={handleClick}
                disabled={isLoading}
                label={localIsFavorite ? 'Remover' : 'Adicionar'}
                variant={localIsFavorite ? 'danger' : 'secondary'}
            />
        </div>
    );
}
