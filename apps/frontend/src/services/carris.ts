const CARRIS_API = 'https://api.carrismetropolitana.pt/v2/lines'

export async function getLines() {
  const res = await fetch(CARRIS_API)
  return res.json()
}
