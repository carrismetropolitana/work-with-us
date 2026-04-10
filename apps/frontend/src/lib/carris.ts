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
    lines: string[]
}

export interface EnrichedLine extends CarrisLine {
    routes: CarrisRoute[]
    stops: CarrisStop[]
}

export async function getEnrichedLines(): Promise<EnrichedLine[]> {
    // Storing as promises to run in parallel (faster)
    const [linesProm, routesProm, stopsProm] = await Promise.all([
        fetch(`${CARRIS_API}/v2/lines`),
        fetch(`${CARRIS_API}/routes`),
        fetch(`${CARRIS_API}/stops`)
    ])
    
    if (!linesProm.ok || !routesProm.ok || !stopsProm.ok) {
        throw new Error('Failed to fetch lines, routes, or stops')
    }

    // Awaiting the JSON parsing after checking the responses to avoid unnecessary parsing if any of the fetches failed
    const [lines, routes, stops]: [CarrisLine[], CarrisRoute[], CarrisStop[]] = await Promise.all([
        linesProm.json(),
        routesProm.json(),
        stopsProm.json()
    ])

    return lines.map(line => ({
        ...line,
        routes: routes.filter(route => route.line_id === line.id), // Matching routes by line_id -> []
        stops: stops.filter(stop => stop.lines.includes(line.id)) // Matching stops by checking if the stop id is in the line's stop_ids array -> []
    }))
}