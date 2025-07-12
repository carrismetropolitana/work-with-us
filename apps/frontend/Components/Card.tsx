import { Button, ComponentWrapper, Label } from '@tmlmobilidade/ui';
import { useEffect, useState } from 'react';

export default function LineCard({ lines }) {
	const [favorites, setFavorites] = useState<Record<string, string>>({});

	const toggleFavorite = async (item) => {
		const isFav = favorites[item.id];

		if (isFav) {
			try {
				const resp = await fetch(`http://localhost:4000/api/favorites/${favorites[item.id]}`, {
					method: 'DELETE',
				});

				if (!resp.ok) throw new Error('Error removing favorite');

				const { [item.id]: _, ...rest } = favorites;
				setFavorites(rest);
			}
			catch (err) {
				console.error(err);
			}
		}
		else {
			try {
				const resp = await fetch('http://localhost:4000/api/favorites', {
					body: JSON.stringify({
						lineId: item.id,
						longName: item.long_name,
					}),
					headers: { 'Content-Type': 'application/json' },
					method: 'POST',
				});

				const newFav = await resp.json(); // must return the inserted document with _id
				setFavorites({ ...favorites, [item.id]: newFav._id });
			}
			catch (err) {
				console.error(err);
			}
		}
	};

	useEffect(() => {
		const fetchFavorites = async () => {
			const resp = await fetch('http://localhost:4000/api/favorites');
			const data = await resp.json();

			const favMap = {};
			data.forEach((fav) => {
				favMap[fav.lineId] = fav._id;
			});
			setFavorites(favMap);
		};

		fetchFavorites();
	}, []);

	return (
		<>
			{lines.map(item => (
				<ComponentWrapper key={item.id}>
					<Label>{item.long_name}</Label>
					<Button
						label={favorites[item.id] ? '❌ Remove' : '⭐ Add'}
						onClick={() => toggleFavorite(item)}
					/>
					<a href={`https://carrismetropolitana.pt/lines/${item.id}`} target="_blank">More Information</a>

				</ComponentWrapper>
			))}
		</>
	);
}
