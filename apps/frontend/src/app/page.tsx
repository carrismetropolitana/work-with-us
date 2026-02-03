'use client';

import { Text } from '@tmlmobilidade/ui';
import useSWR from 'swr';
import { fetchLines, fetchFavorites, addFavorite, removeFavorite, type Line, type Favorite } from './lib/api';
import { LineCard } from './components/LineCard';
import styles from './styles/page.module.css';

/* * */

/**
 * Main Application Page
 */
export default function Page() {
	// Fetch lines and favorites with SWR
	const { data: lines, error: linesError, isLoading: linesLoading } = useSWR<Line[]>(
		'lines',
		fetchLines,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
		}
	);

	const { data: favorites, error: favoritesError, mutate: mutateFavorites } = useSWR<Favorite[]>(
		'favorites',
		fetchFavorites,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
		}
	);

	// Handle favorite toggle
	const handleToggleFavorite = async (lineId: string, isFavorite: boolean) => {
		try {
			if (isFavorite) {
				// Add to favorites
				await addFavorite(lineId);
			} else {
				// Remove from favorites
				await removeFavorite(lineId);
			}

			// Revalidate favorites list
			await mutateFavorites();
		} catch (error) {
			console.error('Error toggling favorite:', error);
			throw error; // Re-throw for FavoriteButton to handle rollback
		}
	};

	// Check if a line is favorited
	const isFavorite = (lineId: string): boolean => {
		return favorites?.some(fav => fav.lineId === lineId) || false;
	};

	// Loading state
	if (linesLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					<Text>A carregar linhas...</Text>
				</div>
			</div>
		);
	}

	// Error state
	if (linesError || favoritesError) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>
					<h2 className={styles.errorTitle}>Erro ao carregar dados</h2>
					<Text className={styles.errorMessage}>
						{linesError?.message || favoritesError?.message || 'Ocorreu um erro desconhecido'}
					</Text>
					<Text className={styles.errorMessage} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
						Certifique-se de que o servidor API está a correr em http://localhost:3001
					</Text>
				</div>
			</div>
		);
	}

	// Main content
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					Linhas Carris Metropolitana
				</h1>
				<Text className={styles.subtitle}>
					Clique numa linha para ver mais detalhes no site oficial
				</Text>
			</div>

			<div className={styles.linesGrid}>
				{lines?.map((line) => (
					<LineCard
						key={line.id}
						line={line}
						isFavorite={isFavorite(line.id)}
						onToggleFavorite={handleToggleFavorite}
					/>
				))}
			</div>
		</div>
	);
}
