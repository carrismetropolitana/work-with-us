/* * */

'use client';

import type { Line } from '@/types';

import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { Button } from '@tmlmobilidade/ui';

/* * */

interface LineCardProps {
	isFavorite: boolean
	line: Line
	onToggleFavorite: (line_id: string) => void
}

/* * */

export function LineCard({ isFavorite, line, onToggleFavorite }: LineCardProps) {
	const handleCardClick = () => {
		window.open(`https://www.carrismetropolitana.pt/lines/${line.id}`, '_blank');
	};

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onToggleFavorite(line.id);
	};

	return (
		<div
			onClick={handleCardClick}
			onMouseEnter={(e) => {
				e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.boxShadow = 'none';
			}}
			style={{
				backgroundColor: '#fff',
				border: '1px solid #e0e0e0',
				borderRadius: '8px',
				cursor: 'pointer',
				padding: '1rem',
				position: 'relative',
				transition: 'box-shadow 0.2s',
			}}
		>
			{/* Botão de Favorito */}
			<div
				onClick={handleFavoriteClick}
				style={{
					cursor: 'pointer',
					position: 'absolute',
					right: '1rem',
					top: '1rem',
				}}
			>
				{isFavorite ? (
					<IconHeartFilled color="red" size={24} />
				) : (
					<IconHeart color="#999" size={24} />
				)}
			</div>

			{/* Badge da Linha */}
			<div
				style={{
					alignItems: 'center',
					backgroundColor: `#${line.color}`,
					borderRadius: '4px',
					color: `#${line.text_color}`,
					display: 'inline-flex',
					fontWeight: 'bold',
					marginBottom: '0.5rem',
					padding: '0.25rem 0.75rem',
				}}
			>
				{line.short_name}
			</div>

			{/* Nome da Linha */}
			<h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0.5rem 0' }}>
				{line.name}
			</h3>

			{/* Descrição */}
			{line.long_name && (
				<p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
					{line.long_name}
				</p>
			)}

			{/* Localidades */}
			{line.localities && line.localities.length > 0 && (
				<div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
					<span style={{ color: '#999' }}>Localidades: </span>
					<span style={{ color: '#666' }}>{line.localities.join(', ')}</span>
				</div>
			)}
		</div>
	);
}
