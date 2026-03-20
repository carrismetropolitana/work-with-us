'use client';
import { useState } from 'react';
import { IconSearch, IconStar, IconStarFilled } from '@tabler/icons-react';
import { Button, Label, Loader, Text, TextInput } from '@tmlmobilidade/ui';
import useSWR from 'swr';
import LineCard from '@/components/LineCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useLineFilter } from '@/hooks/useLineFilter';
import { fetchLines } from '@/lib/api';
import styles from './page.module.css';

export default function Page() {
	const { data: lines, isLoading: linesLoading } = useSWR('lines', fetchLines);
	const { favoriteIds, isLoading: favoritesLoading, toggleFavorite } = useFavorites();
	const { filtered, isFiltering, search, setSearch, showFavoritesOnly, toggleFavoritesFilter } = useLineFilter({ favoriteIds, lines });
	const [visible, setVisible] = useState(30);
	const hasMore = visible < filtered.length;

	if (linesLoading || favoritesLoading) {
		return (
			<div className={styles.center}>
				<Loader visible />
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<Label size="lg">Linhas Carris Metropolitana</Label>
				<Text size="sm">Explora as linhas de metro</Text>
			</div>

			<div className={styles.toolbar}>
				<div className={styles.searchBox}>
					<TextInput
						leftSection={<IconSearch size={16} />}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
						placeholder="Pesquisar por nome ou número..."
						value={search}
					/>
				</div>
				<Button
					icon={showFavoritesOnly ? <IconStarFilled size={14} /> : <IconStar size={14} />}
					label={showFavoritesOnly ? 'Todas' : 'Favoritas'}
					loading={isFiltering}
					onClick={toggleFavoritesFilter}
					variant={showFavoritesOnly ? 'primary' : 'secondary'}
				/>
			</div>

			<Text size="xs">
				{filtered.length} {filtered.length === 1 ? 'linha' : 'linhas'}
				{favoriteIds.size > 0 && ` · ${favoriteIds.size} ${favoriteIds.size === 1 ? 'favorita' : 'favoritas'}`}
			</Text>

			{filtered.length === 0 ? (
				<div className={styles.center}>
					<Text size="sm">
						{showFavoritesOnly ? 'Ainda não tens linhas favoritas.' : 'Nenhuma linha encontrada.'}
					</Text>
				</div>
			) : (
				<>
					<div className={styles.grid}>
						{filtered.slice(0, visible).map(line => (
							<LineCard isFavorite={favoriteIds.has(line.id)} key={line.id} line={line} onToggleFavorite={toggleFavorite} />
						))}
					</div>
					{hasMore && (
						<div className={styles.loadMore}>
							<Button label="Carregar mais" onClick={() => setVisible(v => v + 30)} variant="secondary" />
						</div>
					)}
				</>
			)}
		</div>
	);
}
