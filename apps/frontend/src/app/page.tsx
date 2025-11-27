<<<<<<< HEAD
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
=======
import LineList from '../components/LineList';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <LineList />
    </main>
  );
}
>>>>>>> feat/lines-favorites
