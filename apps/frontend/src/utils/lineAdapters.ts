interface RawCarrisLine {
	color: string
	id: string
	long_name: string
	short_name: string
	text_color: string
}

export interface AppLine {
	color: string
	id: string
	isFavorite?: boolean
	name: string
	shortName: string
	textColor: string
}

export function mapLinesFromCarris(data: RawCarrisLine[]): AppLine[] {
	return data.map(line => ({
		color: line.color,
		id: line.id,
		name: line.long_name,
		shortName: line.short_name,
		textColor: line.text_color,
	}));
}

export interface Favorite {
	createdAt: number
	lineId: string
	operationalDate: string
}
