/* * */

/**
 * API Client for Backend Communication
 * 
 * Centralized API calls for lines and favorites management.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Line {
    id: string;
    long_name: string;
    short_name: string;
    color: string;
    text_color: string;
    localities?: string[];
    municipalities?: string[];
    routes?: string[];
}

export interface Favorite {
    _id?: string;
    lineId: string;
    createdAtUnix: number;
    createdAtOperationalDate: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Fetch all lines from Carris Metropolitana
 */
export async function fetchLines(): Promise<Line[]> {
    const response = await fetch(`${API_BASE_URL}/api/lines`);
    if (!response.ok) {
        throw new Error('Failed to fetch lines');
    }
    const result: ApiResponse<Line[]> = await response.json();
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch lines');
    }
    return result.data;
}

/**
 * Fetch all favorite lines
 */
export async function fetchFavorites(): Promise<Favorite[]> {
    const response = await fetch(`${API_BASE_URL}/api/favorites`);
    if (!response.ok) {
        throw new Error('Failed to fetch favorites');
    }
    const result: ApiResponse<Favorite[]> = await response.json();
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch favorites');
    }
    return result.data;
}

/**
 * Add a line to favorites
 */
export async function addFavorite(lineId: string): Promise<Favorite> {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineId }),
    });

    const result: ApiResponse<Favorite> = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to add favorite');
    }

    if (!result.data) {
        throw new Error('No data returned');
    }

    return result.data;
}

/**
 * Remove a line from favorites
 */
export async function removeFavorite(lineId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/favorites/${lineId}`, {
        method: 'DELETE',
    });

    const result: ApiResponse<{ lineId: string }> = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to remove favorite');
    }
}
