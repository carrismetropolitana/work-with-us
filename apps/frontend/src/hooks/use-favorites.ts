'use client';

import type { Favorite } from '@/types';

import { api } from '@/lib/api';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

const KEY = 'favorites';

export function useFavorites() {
	const { data, error, isLoading, mutate } = useSWR<Favorite[]>(KEY, () => api.listFavorites());

	const favoriteIds = useMemo(() => new Set((data ?? []).map(f => f.line_id)), [data]);

	const isFavorite = useCallback((line_id: string) => favoriteIds.has(line_id), [favoriteIds]);

	const toggle = useCallback(
		async (line_id: string) => {
			const isCurrentlyFavorited = favoriteIds.has(line_id);
			const optimistic: Favorite[] = isCurrentlyFavorited
				? (data ?? []).filter(f => f.line_id !== line_id)
				: [
					{
						created_at: Date.now() as Favorite['created_at'],
						line_id,
						operational_date: '' as Favorite['operational_date'],
					},
					...(data ?? []),
				];

			await mutate(
				async () => {
					if (isCurrentlyFavorited) {
						await api.removeFavorite(line_id);
					}
					else {
						await api.addFavorite(line_id);
					}
					return api.listFavorites();
				},
				{ optimisticData: optimistic, revalidate: false, rollbackOnError: true },
			);
		},
		[data, favoriteIds, mutate],
	);

	return { error, favorites: data ?? [], isFavorite, isLoading, toggle };
}
