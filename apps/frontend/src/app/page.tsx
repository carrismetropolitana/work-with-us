'use client';

import { Loader, Text } from '@tmlmobilidade/ui';
import useSWR from 'swr';

import { LineCard } from './components/lineCard';
import {
	addFavorite,
	type Favorite,
	fetchFavorites,
	fetchLines,
	type Line,
	removeFavorite,
} from './lib/api';

export default function Page() {
	const {
		data: lines,
		error: linesError,
		isLoading: isLoadingLines,
	} = useSWR<Line[]>('lines', fetchLines);

	const {
		data: favorites,
		error: favoritesError,
		isLoading: isLoadingFavorites,
		mutate: mutateFavorites,
	} = useSWR<Favorite[]>('favorites', fetchFavorites);

	const favoriteIds = new Set(favorites?.map(favorite => favorite.lineId) ?? []);

	const handleToggleFavorite = async (lineId: string) => {
		const isFavorite = favoriteIds.has(lineId);

		if (isFavorite) {
			await removeFavorite(lineId);
		}
		else {
			await addFavorite(lineId);
		}

		await mutateFavorites();
	};

	if (isLoadingLines || isLoadingFavorites) {
		return (
			<div style={{ padding: 24 }}>
				<Loader visible />
			</div>
		);
	}

	if (linesError || favoritesError) {
		return (
			<div style={{ padding: 24 }}>
				<Text>Ocorreu um erro ao carregar os dados. Por favor verifique o estado da API.</Text>
			</div>
		);
	}

	if (!lines?.length) {
		return <Text>Sem linhas disponíveis.</Text>;
	}

	return (
		<div style={{ padding: 24 }}>
			<div style={{ marginBottom: 24 }}>
				<h1>Linhas Carris Metropolitana</h1>
				<Text>{lines?.length ?? 0} linhas disponíveis. Explore toda a rede de autocarros da zona metropolitana de Lisboa.</Text>
			</div>

			<div
				style={{
					display: 'grid',
					gap: 24,
				}}
			>
				{lines?.map(line => (
					<LineCard
						key={line.id}
						isFavorite={favoriteIds.has(line.id)}
						line={line}
						onToggleFavorite={handleToggleFavorite}
					/>
				))}
			</div>
		</div>
	);
}
