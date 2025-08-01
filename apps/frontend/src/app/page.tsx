'use client';

import LineGrid from '@/components/LineGrid';
import useFavorites from '@/hooks/useFavorites';
import useLines from '@/hooks/useLines';
import { Button, Combobox, Text } from '@tmlmobilidade/ui';
import Image from 'next/image';
import { useCallback } from 'react';

import styles from './style.module.css';

export default function HomePage() {
	const { favorites } = useFavorites();
	const { changeSort, error, isLoading, lines, search, setSearch, setShowFavoritesOnly, showFavoritesOnly, sortValue } = useLines(favorites);

	const toogleFavoritesOnly = useCallback(() => {
		setShowFavoritesOnly(!showFavoritesOnly);
	}, [showFavoritesOnly]);

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	}, []);

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<div className={styles.leftHeader}>
					<div className={styles.logoWrapper}>
						<Image
							alt="Carris Metropolitana Logo"
							className={styles.logoImage}
							src="/images/logoTML.png"
							fill
						/>
					</div>
					<Text size="xl" weight="extra-bold">Linhas da Carris Metropolitana</Text>
				</div>

				<div className={styles.rightHeader}>
					<Text c="var(--color-system-text-200)" size="sm">Work with me 😊</Text>
					<Text c="var(--color-system-text-100)" size="sm">Afonso Esteves</Text>
				</div>

			</header>

			<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				<div className={styles.searchWrapper}>
					<label className={styles.searchLabel} htmlFor="search">Pesquisar</label>
					<input
						className={styles.searchInput}
						id="search"
						onChange={handleSearchChange}
						placeholder="Nome ou ID da linha"
						type="text"
						value={search}
					/>
				</div>

				<div className={styles.filtersWrapper}>
					<Combobox
						label="Ordenar por"
						onChange={changeSort}
						value={sortValue}
						data={[
							{ label: 'ID (asc)', value: 'id-asc' },
							{ label: 'ID (desc)', value: 'id-desc' },
							{ label: 'Nome (A-Z)', value: 'name-asc' },
						]}
					/>
				</div>
			</div>

			<div className={styles.gridWrapper}>
				<div className={styles.buttonsWrapper}>
					<Button
						label="Todas"
						onClick={toogleFavoritesOnly}
						variant={!showFavoritesOnly ? 'primary' : 'muted'}
					/>
					<Button
						label="Favoritas"
						onClick={toogleFavoritesOnly}
						variant={showFavoritesOnly ? 'primary' : 'muted'}
					/>
				</div>
				<LineGrid
					error={error}
					isLoading={isLoading}
					lines={lines}
					showFavoritesOnly={showFavoritesOnly}
				/>
			</div>
		</div>
	);
}
