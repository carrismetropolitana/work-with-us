'use client';

import type { Favorite, Line } from '@/types';

import { LineCard } from '@/components/LineCard';
import { addFavorite, fetchFavorites, fetchLines, removeFavorite } from '@/services/api';
import { Button } from '@tmlmobilidade/ui';
import { useState } from 'react';
import useSWR from 'swr';

export default function Page() {
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

	// Buscar linhas e favoritos com SWR
	const { data: lines, error: linesError, isLoading: linesLoading } = useSWR<Line[]>('lines', fetchLines);
	const { data: favorites, error: favoritesError, isLoading: favoritesLoading, mutate } = useSWR<Favorite[]>('favorites', fetchFavorites);

	// Set de IDs favoritados para busca rápida
	const favoriteIds = new Set(favorites?.map(f => f.line_id) || []);

	// Toggle favorito
	const handleToggleFavorite = async (line_id: string) => {
		try {
			if (favoriteIds.has(line_id)) {
				// Atualizar UI otimisticamente
				mutate(
					favorites?.filter(f => f.line_id !== line_id),
					false,
				);
				await removeFavorite(line_id);
			}
			else {
				await addFavorite(line_id);
			}
			// Revalidar lista de favoritos
			mutate();
		}
		catch (error) {
			console.error('Erro ao toggle favorito:', error);
			alert('Erro ao atualizar favorito. Tente novamente.');
			// Reverter mudança otimista em caso de erro
			mutate();
		}
	};

	// Filtrar linhas
	const displayedLines = showOnlyFavorites
		? lines?.filter(line => favoriteIds.has(line.id))
		: lines;

	// Estados de loading e erro
	if (linesLoading || favoritesLoading) {
		return (
			<div style={{ padding: '2rem', textAlign: 'center' }}>
				<h2>Carregando...</h2>
			</div>
		);
	}

	if (linesError || favoritesError) {
		return (
			<div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>
				<h2>Erro ao carregar dados</h2>
				<p>Por favor, verifique se a API está rodando.</p>
			</div>
		);
	}

	return (
		<div style={{ margin: '0 auto', maxWidth: '1400px', padding: '2rem' }}>
			{/* Header */}
			<div style={{ marginBottom: '2rem' }}>
				<h1 style={{ marginBottom: '1rem' }}>
					Linhas Carris Metropolitana
				</h1>

				{/* Botão de filtro */}
				<Button
					label={showOnlyFavorites ? 'Mostrar Todas' : 'Mostrar Favoritos'}
					onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
				/>

				<p style={{ color: '#666', marginTop: '1rem' }}>
					{displayedLines?.length || 0} linhas • {favorites?.length || 0} favoritos
				</p>
			</div>

			{/* Grid de linhas */}
			{displayedLines && displayedLines.length > 0 ? (
				<div style={{
					display: 'grid',
					gap: '1.5rem',
					gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
				}}
				>
					{displayedLines.map(line => (
						<LineCard
							key={line.id}
							isFavorite={favoriteIds.has(line.id)}
							line={line}
							onToggleFavorite={handleToggleFavorite}
						/>
					))}
				</div>
			) : (
				<div style={{ color: '#999', padding: '3rem', textAlign: 'center' }}>
					<p>Nenhuma linha encontrada.</p>
				</div>
			)}
		</div>
	);
}
