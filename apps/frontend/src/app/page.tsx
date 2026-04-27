'use client';

import { LinesGrid } from '@/components/lines-grid';
import { useFavorites } from '@/hooks/use-favorites';
import { useLines } from '@/hooks/use-lines';
import { Loader } from '@tmlmobilidade/ui';
import { useMemo } from 'react';

import styles from './page.module.css';

export default function Page() {
	const { error: linesError, isLoading: linesLoading, lines } = useLines();
	const { error: favoritesError, isFavorite } = useFavorites();

	const favoriteLines = useMemo(() => lines.filter(l => isFavorite(l.id)), [lines, isFavorite]);

	return (
		<main className={styles.page}>
			<header className={styles.header}>
				<h1>Linhas — Carris Metropolitana</h1>
				<p>Marca as tuas linhas favoritas. Clica numa linha para abrir a página no site da CM.</p>
			</header>

			{linesError && (
				<div className={styles.error}>Erro ao carregar as linhas: {String(linesError)}</div>
			)}

			{favoritesError && (
				<div className={styles.error}>
					Erro ao contactar a API de favoritos. Verifica que o backend e o MongoDB estão a correr.
				</div>
			)}

			{linesLoading ? (
				<div className={styles.center}>
					<Loader visible />
				</div>
			) : (
				<>
					{favoriteLines.length > 0 && (
						<section className={styles.section}>
							<h2 className={styles.sectionTitle}>Favoritas ({favoriteLines.length})</h2>
							<LinesGrid lines={favoriteLines} />
						</section>
					)}

					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Todas as linhas ({lines.length})</h2>
						<LinesGrid emptyMessage="Sem linhas para mostrar." lines={lines} />
					</section>
				</>
			)}
		</main>
	);
}
