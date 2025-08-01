import { API_ROUTES } from '@/consts/apiRoutes';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

const FAVORITES_ROUTE = API_ROUTES.FAVORITES;

const fetcher = (url: string) => fetch(url).then(res => res.json());

function getToday() {
	const date = new Date();
	return date.toISOString().slice(0, 10).replace(/-/g, ''); // e.g. 20250731
}

export default function useFavorites() {
	const { data, isLoading, mutate } = useSWR(FAVORITES_ROUTE, fetcher);
	const [isToggling, setIsToggling] = useState(false);

	const favorites = useMemo(() => data ?? [], [data]);

	const isFavorite = useCallback(
		(id: string) => favorites?.some(f => f.lineId === id),
		[favorites],
	);

	const toggleFavorite = async (lineId: string) => {
		setIsToggling(true);

		const isFav = favorites.some(f => f.lineId === lineId);

		// optimistic update
		await mutate(
			async (current = []) => {
				const updated = isFav
					? current.filter(f => f.lineId !== lineId)
					: [...current, {
						createdAt: new Date().toISOString(),
						lineId,
						operationalDate: getToday(),
					}];

				try {
					if (isFav) {
						await fetch(`${FAVORITES_ROUTE}/${lineId}`, { method: 'DELETE' });
					}
					else {
						await fetch(FAVORITES_ROUTE, {
							body: JSON.stringify({ lineId }),
							headers: { 'Content-Type': 'application/json' },
							method: 'POST',
						});
					}
				}
				catch (err) {
					console.error('Failed to update favorite:', err);
				}

				return updated;
			},
			{
				populateCache: true,
				revalidate: false,
				rollbackOnError: true,
			},
		);

		setIsToggling(false);
	};

	return { favorites, isFavorite, isLoading, isToggling, toggleFavorite };
}
