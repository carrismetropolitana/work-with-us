//'use client';

//import { get } from 'http';
// import { Button } from '@tmlmobilidade/ui';
// 
// export default function Page() {
// 	return (
// 		<div>
// 			<Button label="Click Me" onClick={() => alert('Button Clicked!')} />
// 			<h1>Welcome to TML Frontend</h1>
// 		</div>
// 	);
// }
// 

import LineCard from '../components/LineCard'
import { getEnrichedLines } from '../lib/carris'

const mockLine = {
	id: '1903',
	short_name: '1903',
	long_name: 'Alfragide (Estr Seminario) - Reboleira (Estação)',
	color: '#1a3fe4',
	text_color: '#ffffff',
	route_ids: ['1903_0'],
	stop_ids: ['030001', '030002'],
	tts_name: 'Linha 1903',
	routes: [{ id: '1903_0', line_id: '1903', long_name: 'Rota 1903', tts_name: 'Rota Alfragide' }],
	stops: [{ id: '030001', long_name: 'Alfragide' }, { id: '030002', long_name: 'Reboleira' }],
}

export default async function Page() {
	const lines = await Promise.all(getEnrichedLines())
	return (
		<div style={{ padding: '40px', 'maxWidth': '700px' }}>
			<h1>Minha Carris Metropolitana</h1>
			<LineCard line={mockLine} isFavorite={true} onToggleFavorite={(lineId) => console.log('debug: favorite for line:', lineId)} />
		</div>
	)
}	
