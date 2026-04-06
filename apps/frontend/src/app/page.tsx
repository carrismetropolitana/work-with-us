'use client';

import { Button } from '@tmlmobilidade/ui';
import { useEffect, useState } from 'react';

interface Line {
	color: string
	id: string
	long_name: string
	short_name: string
	tts_name: string
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export default function Page() {
	const [lines, setLines] = useState<Line[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [expanded, setExpanded] = useState<null | string>(null);

	async function getLines() {
		try {
			const res = await fetch(`https://api.carrismetropolitana.pt/v2/lines`);
			const data = await res.json();
			setLines(data);
		}
		catch (err) {
			console.error(err);
		}
	}

	async function getFavorites() {
		try {
			const res = await fetch(`${apiUrl}/favorites`);
			const data = await res.json();
			if (Array.isArray(data)) {
				setFavorites(data.map(f => f.lineId));
			}
			else {
				console.warn('Expected array from /favorites API, got:', data);
				setFavorites([]);
			}
		}
		catch (err) {
			console.error(err);
		}
	}

	async function toggleFavorite(line: Line) {
		const isFav = favorites.includes(line.id);

		try {
			if (isFav) {
				await fetch(`${apiUrl}/favorites/${line.id}`, { method: 'DELETE' });
				setFavorites(prev => prev.filter(f => f !== line.id));
			}
			else {
				await fetch(`${apiUrl}/favorites`, {
					body: JSON.stringify({
						lineId: line.id,
						longName: line.long_name,
						shortName: line.short_name,
					}),
					headers: { 'Content-Type': 'application/json' },
					method: 'POST',
				});
				setFavorites(prev => [...prev, line.id]);
			}
		}
		catch (err) {
			console.error(err);
		}
	}

	function toggleExpand(id: string) {
		setExpanded(prev => (prev === id ? null : id));
	}

	useEffect(() => {
		getLines();
		getFavorites();
		console.log('API URL:', apiUrl);
	}, []);

	return (
		<div>
			<h2>Lines</h2>

			{lines.map((line) => {
				const isFav = favorites.includes(line.id);
				const isOpen = expanded === line.id;

				return (
					<div
						key={line.id}
						style={{
							border: '1px solid #ccc',
							borderRadius: '8px',
							marginBottom: '10px',
							padding: '10px',
						}}
					>
						<div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>

							{/* Mini color square */}
							<div style={{
								backgroundColor: line.color,
								border: '1px solid #000',
								height: '16px',
								marginRight: '8px',
								width: '16px',
							}}
							/>

							<a
								href={'https://carrismetropolitana.pt/lines/' + line.id}
								rel="noopener noreferrer"
								style={{ color: 'inherit', flex: 1, textDecoration: 'underline' }}
								target="_blank"
							>
								<strong>{line.short_name}</strong> — {line.long_name}
							</a>

							<div>
								<Button
									label={isFav ? '★' : '☆'}
									onClick={() => toggleFavorite(line)}
								/>

								<Button
									label={isOpen ? '−' : '+'}
									onClick={() => toggleExpand(line.id)}
								/>
							</div>
						</div>

						{isOpen && (
							<div style={{ marginTop: '10px' }}>
								<p><strong>ID:</strong> {line.id}</p>
								<p><strong>Nome:</strong> {line.long_name}</p>
								<p><strong>Descrição:</strong> {line.tts_name}</p>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
