/* * */

import '@tmlmobilidade/ui/styles';
import { ThemeContextProvider } from '@tmlmobilidade/ui';
import { Metadata } from 'next';
import { type PropsWithChildren } from 'react';

/* * */

export const metadata: Metadata = {
	description: 'TML Frontend',
	title: 'TML Frontend',
};

/* * */

export default async function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeContextProvider>
					{children}
				</ThemeContextProvider>
			</body>
		</html>
	);
}
