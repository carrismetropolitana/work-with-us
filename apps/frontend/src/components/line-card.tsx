'use client';

import type { Line } from '@/types';

import { env } from '@/lib/env';

import styles from './line-card.module.css';

import { FavoriteButton } from './favorite-button';

interface Props {
	line: Line
}

export function LineCard({ line }: Props) {
	return (
		<a
			className={styles.card}
			href={env.cm_line_url(line.id)}
			style={{ backgroundColor: line.color, color: line.text_color }}
		>
			<span
				className={styles.badge}
				style={{ backgroundColor: line.text_color, color: line.color }}
			>
				{line.short_name}
			</span>
			<div className={styles.text}>
				<div className={styles.longName} title={line.long_name}>
					{line.long_name}
				</div>
			</div>
			<div className={styles.actions}>
				<FavoriteButton line_id={line.id} />
			</div>
		</a>
	);
}
