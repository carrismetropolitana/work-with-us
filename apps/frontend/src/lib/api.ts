import { Line } from '@/types/line';
const API_URL = 'http://localhost:49026';
const CARRIS_API_URL = 'https://api.carrismetropolitana.pt/v2';

export interface FavoriteResponse {
	_id: string;
	line_id: string;
	createdAt: number;
	operationalDate: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(url, options);
	if (!res.ok) {
		throw new Error(`Request failed: ${res.status} ${res.statusText}`);
	}
	if (res.status === 204) return undefined as T;
	return res.json();
}

export async function fetchLines(): Promise<Line[]> {
	return request<Line[]>(`${CARRIS_API_URL}/lines`);
}

export async function fetchFavorites(): Promise<FavoriteResponse[]> {
	return request<FavoriteResponse[]>(`${API_URL}/favorites`);
}

export async function addFavorite(lineId: string): Promise<void> {
	return request(`${API_URL}/favorites`, {
		body: JSON.stringify({ line_id: lineId }),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	});
}

export async function removeFavorite(lineId: string): Promise<void> {
	return request(`${API_URL}/favorites/${lineId}`, {
		method: 'DELETE',
	});
}
