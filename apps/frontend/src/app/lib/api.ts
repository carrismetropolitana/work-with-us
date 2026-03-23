export interface Line {
	color?: string
	id: string
	long_name?: string
	name: string
	short_name?: string
}

export interface Favorite {
	createdAt: number
	lineId: string
	operationalDate: string
}

const API_URL = 'http://localhost:49026';
const CARRIS_API_URL = 'https://api.carrismetropolitana.pt/v2';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`Request failed: ${response.status} ${response.statusText}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}

export async function fetchLines(): Promise<Line[]> {
	return request<Line[]>(`${CARRIS_API_URL}/lines`);
}

export async function fetchFavorites(): Promise<Favorite[]> {
	return request<Favorite[]>(`${API_URL}/favorites`);
}

export async function addFavorite(lineId: string): Promise<Favorite> {
	return request<Favorite>(`${API_URL}/favorites`, {
		body: JSON.stringify({ lineId }),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});
}

export async function removeFavorite(lineId: string): Promise<void> {
	return request(`${API_URL}/favorites/${lineId}`, {
		method: 'DELETE',
	});
}
