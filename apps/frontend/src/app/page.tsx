'use client';

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

export default function Page() {
	return (
		<div style={{ padding: '40px', 'maxWidth': '700px' }}>
			<LineCard line={{line}} isFavorite={true} onToggleFavorite={(lineId) => console.log('Toggled favorite for line:', lineId)} />
		</div>
	)
}	
