import { useCallback, useMemo, useOptimistic, useRef, useTransition } from 'react';
import useSWR from 'swr';
import { addFavorite, fetchFavorites, removeFavorite } from '@/lib/api';

type OptimisticAction = { lineId: string; type: 'add' | 'remove' };

export function useFavorites() {
	const { data, error, isLoading, mutate } = useSWR('favorites', fetchFavorites);
	const favoriteIds = useMemo(() => new Set(data?.map(f => f.line_id) ?? []), [data]);

	const idsRef = useRef(favoriteIds);
	idsRef.current = favoriteIds;

	const [optimisticIds, dispatchOptimistic] = useOptimistic(
		favoriteIds,
		(current: Set<string>, action: OptimisticAction) => {
			const next = new Set(current);
			action.type === 'add' ? next.add(action.lineId) : next.delete(action.lineId);
			return next;
		},
	);

	const [, startTransition] = useTransition();
	const toggleFavorite = useCallback((lineId: string) => {
		const removing = idsRef.current.has(lineId);
		startTransition(async () => {
			dispatchOptimistic({ lineId, type: removing ? 'remove' : 'add' });
			try {
				await (removing ? removeFavorite(lineId) : addFavorite(lineId));
			} catch {} finally {
				mutate();
			}
		});
	}, [mutate, dispatchOptimistic, startTransition]);

	return { error, favoriteIds: optimisticIds, isLoading, toggleFavorite };
}
