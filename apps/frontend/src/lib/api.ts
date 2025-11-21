import { Line, Favorite } from '../types/line';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchLines(): Promise<Line[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/lines`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching lines:', error);
    throw new Error(`Failed to fetch lines: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchFavorites(): Promise<Favorite[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw new Error(`Failed to fetch favorites: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


export async function toggleFavorite(line: Line) {
  const payload = {
    lineId: line.id,
    lineData: {
      short_name: line.short_name,
      long_name: line.long_name,
      tts_name: line.tts_name || '',
      color: line.color || '#2563eb',
      text_color: line.text_color || '#ffffff',
      facilities: line.facilities || []
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    throw error;
  }
}
