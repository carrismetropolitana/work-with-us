const CARRIS_API = process.env.CARRIS_PUBLIC_API_URL || 'https://api.carrismetropolitana.pt'

export interface CarrisLine {
    id: string
    short_name: string
    long_name: string
    color: string
    text_color: string
    route_ids: string[]
    stop_ids: string[]
    tts_name: string
}

// The API returns the routes and stops as a full array,
// so map/filter will run for each line to get its routes and stops.
// This is not ideal, but it is the only way
export interface CarrisRoute {
    id: string
    line_id: string
    long_name: string
    tts_name: string
    color: string
    text_color: string
}

export interface CarrisStop {
    id: string
    long_name: string
    lat: number
    lon: number
}

export interface ErinchedLine extends CarrisLine {
    routes: CarrisRoute[]
    stops: CarrisStop[]
}

export async function getCarrisLines(): Promise<CarrisLine[]> {
    const response = await fetch(`${CARRIS_API}/v2/lines`)
  
    if (!response.ok) {
        throw new Error('Failed to fetch lines')
    }

    return response.json()
}