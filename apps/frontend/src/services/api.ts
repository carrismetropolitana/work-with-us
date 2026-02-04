/* * */

import type { Favorite, Line } from '@/types';

/* * */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
const CM_API_URL = 'https://api.carrismetropolitana.pt/v2';

/* * */

// Carris Metropolitana API
export async function fetchLines(): Promise<Line[]> {
	const response = await fetch(`${CM_API_URL}/lines`);
	if (!response.ok) {
		throw new Error('Failed to fetch lines');
	}
	return response.json();
}

/* * */

// Nossa API - Favoritos
export async function fetchFavorites(): Promise<Favorite[]> {
	const response = await fetch(`${API_URL}/favorites`);
	if (!response.ok) {
		throw new Error('Failed to fetch favorites');
	}
	return response.json();
}

/* * */

export async function addFavorite(line_id: string): Promise<Favorite> {
	const response = await fetch(`${API_URL}/favorites`, {
		body: JSON.stringify({ line_id }),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Failed to add favorite');
	}

	return response.json();
}

/* * */

export async function removeFavorite(line_id: string): Promise<void> {
	const response = await fetch(`${API_URL}/favorites/${line_id}`, {
		method: 'DELETE',
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Failed to remove favorite');
	}
}
