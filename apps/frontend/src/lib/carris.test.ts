import { getEnrichedLines } from './carris'

async function test() {
  const lines = await getEnrichedLines()
  
  const withStops = lines.filter(l => l.stops.length > 0)
  const withoutStops = lines.filter(l => l.stops.length === 0)

  console.log(`Total lines: ${lines.length}`)
  console.log(`With stops: ${withStops.length}`)
  console.log(`Without stops: ${withoutStops.length}`)
  
  //console.log('\nFirst line with stops:')
  //console.log(JSON.stringify(withStops[0], null, 2))
  //
  //console.log('\nFirst line without stops:')
  //console.log(JSON.stringify(withoutStops[0], null, 2))
}

test().catch(console.error)