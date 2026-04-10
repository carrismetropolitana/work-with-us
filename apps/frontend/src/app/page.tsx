import LineCard from '../components/LineCard'
import { getEnrichedLines , EnrichedLine } from '../lib/carris'

// Setting up each content of the page
interface LinesGridProps {
  lines: EnrichedLine[]
  initialFavorites: string[]
}

export default async function Page() {
	const lines = await getEnrichedLines()
	return (
		<div style={{ padding: '40px', 'maxWidth': '1000px', margin: '0 auto' }}>
			<h1>Minha Carris Metropolitana</h1>
			
			{/* List of lines */}
			<div style={{
				display: 'grid',
				marginTop: '24px',
				gap: '16px',
				gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))'
			}}> { /* A map for each line from the enriched lines getter */ } 
				{lines.map(line => (
					<LineCard key={line.id} line={line} isFavorite={false} />
				))}
			</div>

		</div>
	)
}	
