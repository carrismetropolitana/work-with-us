'use client';

import type { Line } from '../lib/api';

import { IconArrowUpRight, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { Badge, Button } from '@tmlmobilidade/ui';

interface LineCardProps {
	isFavorite: boolean
	line: Line
	onToggleFavorite: (lineId: string) => void
}

const CARRIS_BASE_URL = 'https://www.carrismetropolitana.pt/lines';

export function LineCard({
	isFavorite,
	line,
	onToggleFavorite,
}: LineCardProps) {
	return (
		<div
			style={{
				border: '2px solid #ddd',
				borderLeft: `8px solid ${line.color || '#ddd'}`,
				borderRadius: 8,
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
				height: '100%',
				padding: 16,
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				<Badge style={{ width: 'fit-content' }} type="pill" variant="primary">
					{line.short_name || line.name}
				</Badge>

				<div style={{ fontSize: 16 }}>
					{line.long_name || line.name}
				</div>
			</div>

			<div style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: 8,
			}}
			>
				<Button
					icon={isFavorite ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
					label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
					onClick={() => onToggleFavorite(line.id)}
					variant={isFavorite ? 'danger' : 'primary'}
				/>

				<Button
					icon={<IconArrowUpRight size={16} />}
					label="Ver no site"
					onClick={() => window.open(`${CARRIS_BASE_URL}/${line.id}`, '_blank')}
					variant="secondary"
				/>
			</div>
		</div>
	);
}
