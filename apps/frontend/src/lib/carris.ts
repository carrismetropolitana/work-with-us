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

export async function getCarrisLines(): Promise<CarrisLine[]> {
  const response = await fetch(`${CARRIS_API}/v2/lines`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch lines')
  }

  return response.json()
}