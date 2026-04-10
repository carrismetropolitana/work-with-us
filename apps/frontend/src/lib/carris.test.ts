import { getEnrichedLines } from './carris'

async function testGetEnrichedLines() {
    try {
        const lines = await getEnrichedLines()
        console.log('-------------------------------')
        console.log(`Total lines: ${lines.length}`)
        console.log('First line:', JSON.stringify(lines[4], null, 2))
        console.log('Routes on first line:', lines[4].routes.length)
        console.log('Stops on first line:', lines[4].stops.length)
    } catch (error) {
        console.error('Error fetching Carris lines:', error)
    }
}

testGetEnrichedLines()