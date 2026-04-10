import { getCarrisLines } from './carris'

async function testGetCarrisLines() {
  try {
    const lines = await getCarrisLines()
    console.log('Carris Lines:', lines)
  } catch (error) {
    console.error('Error fetching Carris lines:', error)
  }
}

testGetCarrisLines()