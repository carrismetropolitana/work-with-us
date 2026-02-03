/* * */

/**
 * Line data structure from Carris Metropolitana API
 */
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

/**
 * Favorite record stored in MongoDB
 */
export interface Favorite {
    _id?: string;
    lineId: string;
    createdAtUnix: number; // Unix timestamp in seconds
    createdAtOperationalDate: string; // Operational date from TML utils
}

/**
 * API Response types
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
