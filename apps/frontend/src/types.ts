import type { OperationalDate, UnixTimestamp } from '@tmlmobilidade/types';

export interface Line {
	color: string
	id: string
	long_name: string
	short_name: string
	text_color: string
}

export interface Favorite {
	created_at: UnixTimestamp
	line_id: string
	operational_date: OperationalDate
}
