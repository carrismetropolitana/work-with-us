import { TML_LINE_DETAILS_URL } from '@/consts/consts';
import useFavorites from '@/hooks/useFavorites';
import { AppLine } from '@/utils/lineAdapters';
import { ActionIcon, Badge, Text } from '@tmlmobilidade/ui';
import { memo } from 'react';

import styles from './style.module.css';

interface LineCardProps {
	line: AppLine
}

const LineCard = ({ line }: LineCardProps) => {
	const { isToggling, toggleFavorite } = useFavorites();

	const handleClick = () => {
		window.open(`${TML_LINE_DETAILS_URL}/${line.id}`, '_blank');
	};

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleFavorite(line.id);
	};

	return (
		<div className={styles.card} onClick={handleClick}>
			<div className={styles.info}>
				<Badge
					style={{
						backgroundColor: line.color,
						color: line.textColor,
						cursor: 'inherit',
					}}
				>
					{line.id}
				</Badge>
				<Text className={styles.name}>{line.name}</Text>
			</div>

			<div className={styles.actions}>
				<ActionIcon
					aria-label="Favoritar linha"
					loading={isToggling}
					onClick={handleToggleFavorite}
					variant={line.isFavorite ? 'primary' : 'secondary'}
				>
					{line.isFavorite ? '❤️' : '🤍'}
				</ActionIcon>

				<span className={styles.arrow}>→</span>
			</div>
		</div>
	);
};

export default memo(LineCard);
