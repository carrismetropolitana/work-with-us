/* * */

import mongoose, { Document, Schema } from 'mongoose';

/* * */

export interface IFavorite extends Document {
	created_at_operational_date: string
	created_at_unix: number
	line_id: string
}

/* * */

const FavoriteSchema = new Schema<IFavorite>({
	created_at_operational_date: {
		required: true,
		type: String,
	},
	created_at_unix: {
		required: true,
		type: Number,
	},
	line_id: {
		index: true,
		required: true,
		type: String,
		unique: true,
	},
}, {
	timestamps: true,
});

/* * */

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
