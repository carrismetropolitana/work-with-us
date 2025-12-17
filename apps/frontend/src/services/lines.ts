const LINES_API = 'https://api.carrismetropolitana.pt/v2/lines'

export async function getLines() {
  const res = await fetch(LINES_API)
  return res.json()
}
