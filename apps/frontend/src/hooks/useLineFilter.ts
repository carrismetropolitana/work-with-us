import { useDeferredValue, useMemo, useState, useTransition } from 'react';
import { Line } from '@/types/line';

export function useLineFilter({ favoriteIds, lines }: { favoriteIds: Set<string>; lines: Line[] | undefined }) {
	const [search, setSearch] = useState('');
	const deferredSearch = useDeferredValue(search);
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
	const [isFiltering, startFilterTransition] = useTransition();

	const filtered = useMemo(() => {
		const query = deferredSearch.toLowerCase();
		return (lines ?? [])
			.filter(l => !query || l.short_name.toLowerCase().includes(query) || l.long_name.toLowerCase().includes(query))
			.filter(l => !showFavoritesOnly || favoriteIds.has(l.id));
	}, [lines, deferredSearch, showFavoritesOnly, favoriteIds]);

	function toggleFavoritesFilter() {
		startFilterTransition(() => setShowFavoritesOnly(prev => !prev));
	}

	return { filtered, isFiltering, search, setSearch, showFavoritesOnly, toggleFavoritesFilter };
}
