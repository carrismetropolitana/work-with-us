'use client';
import { memo } from 'react';
import { IconArrowUpRight, IconStarFilled, IconStarOff } from '@tabler/icons-react';
import { Badge, Button, Text } from '@tmlmobilidade/ui';
import { Line } from '@/types/line';
import styles from './styles.module.css';

interface LineCardProps {
	isFavorite: boolean;
	line: Line;
	onToggleFavorite: (lineId: string) => void;
}

const CARRIS_BASE_URL = 'https://www.carrismetropolitana.pt/lines';

export default memo(function LineCard({ isFavorite, line, onToggleFavorite }: LineCardProps) {
	return (
		<article className={styles.card}>
			<div className={styles.colorBar} style={{ backgroundColor: line.color }} />
			<div className={styles.body}>
				<Badge variant="primary" size="sm">{line.short_name}</Badge>
				<Text size="xs">{line.long_name}</Text>
			</div>
			<div className={styles.footer}>
				<a className={styles.siteLink} href={`${CARRIS_BASE_URL}/${line.id}`} rel="noopener noreferrer" target="_blank">
					Ver no site <IconArrowUpRight size={12} />
				</a>
				<Button
					icon={isFavorite ? <IconStarFilled size={14} /> : <IconStarOff size={14} />}
					label={isFavorite ? 'Remover' : 'Favoritar'}
					onClick={() => onToggleFavorite(line.id)}
					variant={isFavorite ? 'danger' : 'secondary'}
				/>
			</div>
		</article>
	);
});
