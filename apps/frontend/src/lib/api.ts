import type { Favorite } from '@/types';

import { env } from './env';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${env.api_base_url}${path}`, {
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
	if (!response.ok) {
		throw new Error(`API ${response.status} ${response.statusText}`);
	}
	if (response.status === 204) return undefined as T;
	return response.json() as Promise<T>;
}

export const api = {
	addFavorite: (line_id: string) =>
		request<Favorite>('/favorites', { body: JSON.stringify({ line_id }), method: 'POST' }),
	listFavorites: () => request<Favorite[]>('/favorites'),
	removeFavorite: (line_id: string) =>
		request<undefined>(`/favorites/${encodeURIComponent(line_id)}`, { method: 'DELETE' }),
};
