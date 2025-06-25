'use client';

import { Button } from '@tmlmobilidade/ui';

export default function Page() {
	return (
		<div>
			<Button label="Click Me" onClick={() => alert('Button Clicked!')} />
			<h1>Welcome to TML Frontend</h1>
		</div>
	);
}
