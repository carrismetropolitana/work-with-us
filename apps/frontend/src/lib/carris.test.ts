import { getEnrichedLines } from './carris'

async function testGetEnrichedLines() {
    try {
        const lines = await getEnrichedLines()
        console.log('Carris Lines:', lines)
    } catch (error) {
        console.error('Error fetching Carris lines:', error)
    }
}

testGetEnrichedLines()