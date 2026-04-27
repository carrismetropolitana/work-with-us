'use client';

import type { Line } from '@/types';

import styles from './lines-grid.module.css';

import { LineCard } from './line-card';

interface Props {
	emptyMessage?: string
	lines: Line[]
}

export function LinesGrid({ emptyMessage, lines }: Props) {
	if (lines.length === 0 && emptyMessage) {
		return <p className={styles.empty}>{emptyMessage}</p>;
	}
	return (
		<div className={styles.grid}>
			{lines.map(line => (
				<LineCard key={line.id} line={line} />
			))}
		</div>
	);
}
