'use client';

import LineCard from '@/components/LineCard';
import { AppLine } from '@/utils/lineAdapters';
import { Loader, Text } from '@tmlmobilidade/ui';

interface LineGridProps {
	error: Error
	isLoading: boolean
	lines: AppLine[]
	showFavoritesOnly: boolean
}

export default function LineGrid({ error, isLoading, lines, showFavoritesOnly }: LineGridProps) {
	if (isLoading) return <Loader />;

	if (error) return <Text>Erro ao carregar as linhas.</Text>;

	if (lines.length === 0) {
		return (
			<Text>
				{showFavoritesOnly
					? 'Ainda não tem favoritos. Adicione uma linha clicando no coração ❤️'
					: 'Nenhuma linha encontrada.'}
			</Text>
		);
	}

	return (
		<>
			{lines.map(line => (
				<LineCard key={line.id} line={line} />
			))}
		</>
	);
}
