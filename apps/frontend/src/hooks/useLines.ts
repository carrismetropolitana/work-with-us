import { TML_LINES_URL } from '@/consts/consts';
import { AppLine, Favorite, mapLinesFromCarris } from '@/utils/lineAdapters';
import { useDebouncedValue } from '@tmlmobilidade/ui';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

export type SortOption = 'id-asc' | 'id-desc' | 'name-asc';

const linesFetcher = (url: string) =>
	fetch(url).then(res => res.json().then(mapLinesFromCarris));

export default function useLines(favoritesData) {
	const [sortValue, setSortValue] = useState<SortOption>('id-asc');
	const [search, setSearch] = useState('');
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [debouncedSearch] = useDebouncedValue(search, 300);

	const {
		data: linesData,
		error: linesError,
	} = useSWR(TML_LINES_URL, linesFetcher);

	const sortLines = useCallback((lines: AppLine[], sort: SortOption) => {
		return [...lines].sort((a, b) => {
			if (sort === 'id-asc') return a.id.localeCompare(b.id);
			if (sort === 'id-desc') return b.id.localeCompare(a.id);
			return a.name.localeCompare(b.name);
		});
	}, []);

	const enrichWithFavorites = useCallback((lines: AppLine[], favorites: Favorite[]) => {
		const favoriteSet = new Set(favorites.map(f => f.lineId));
		return lines.map(line => ({
			...line,
			isFavorite: favoriteSet.has(line.id),
		}));
	}, []);

	const [visibleLines, setVisibleLines] = useState<AppLine[]>([]);

	useEffect(() => {
		async function process() {
			if (!linesData || !favoritesData) return;
			const enriched = enrichWithFavorites(linesData, favoritesData);
			const sorted = sortLines(enriched, sortValue);

			const filtered = showFavoritesOnly
				? sorted.filter(line => line.isFavorite)
				: sorted;

			const searched = !debouncedSearch.trim()
				? filtered
				: filtered.filter(line =>
					line.name.toLowerCase().includes(debouncedSearch.toLowerCase())
					|| line.id.toLowerCase().includes(debouncedSearch.toLowerCase()),
				);

			setVisibleLines(searched);
			setIsLoading(false);
		}

		process();
	}, [
		linesData,
		favoritesData,
		sortValue,
		showFavoritesOnly,
		debouncedSearch,
		enrichWithFavorites,
		sortLines,
	]);

	const changeSort = useCallback((value: SortOption) => {
		setSortValue(value);
	}, []);

	return {
		changeSort,
		error: linesError,
		isLoading,
		lines: visibleLines,
		search,
		setSearch,
		setShowFavoritesOnly,
		showFavoritesOnly,
		sortValue,
	};
}
