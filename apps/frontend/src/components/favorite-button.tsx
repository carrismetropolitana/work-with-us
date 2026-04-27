'use client';

import { useFavorites } from '@/hooks/use-favorites';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { ActionIcon, useToast } from '@tmlmobilidade/ui';

interface Props {
	line_id: string
}

export function FavoriteButton({ line_id }: Props) {
	const { isFavorite, toggle } = useFavorites();
	const favorited = isFavorite(line_id);

	const handleClick = async (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		try {
			await toggle(line_id);
		}
		catch {
			useToast.error({ message: 'Não foi possível atualizar o favorito.', title: 'Erro' });
		}
	};

	return (
		<ActionIcon
			aria-label={favorited ? `Remover linha ${line_id} dos favoritos` : `Marcar linha ${line_id} como favorita`}
			onClick={handleClick}
			variant={favorited ? 'warning' : 'muted'}
		>
			{favorited ? <IconStarFilled size={20} /> : <IconStar size={20} />}
		</ActionIcon>
	);
}
