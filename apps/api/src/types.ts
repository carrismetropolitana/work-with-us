import type { OperationalDate, UnixTimestamp } from '@tmlmobilidade/types';

export interface Favorite {
	created_at: UnixTimestamp
	line_id: string
	operational_date: OperationalDate
}
