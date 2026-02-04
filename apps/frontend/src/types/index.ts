/* * */

export interface Line {
	color: string
	facilities: string[]
	id: string
	localities: string[]
	long_name: string
	name: string
	short_name: string
	text_color: string
}

/* * */

export interface Favorite {
	_id: string
	created_at_operational_date: string
	created_at_unix: number
	createdAt: string
	line_id: string
	updatedAt: string
}
