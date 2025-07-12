'use client';

import { Loader } from '@tmlmobilidade/ui';
import { useEffect, useState } from 'react';

import LineCard from '../../Components/Card';

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [linesList, setLinesList] = useState([]);

	useEffect(() => {
		setLoading(true);

		const loadLines = async () => {
			try {
				const resp = await fetch('https://api.carrismetropolitana.pt/v2/lines');
				const data = await resp.json();
				setLinesList(data);
				setLoading(false);
			}
			catch (error) {
				console.log(error.message);
			}
		};
		loadLines();
	}, []);
	return (
		<div>
			<h1>Welcome to TML Frontend</h1>
			{loading ? <Loader /> : <LineCard lines={linesList} />}
		</div>
	);
}
