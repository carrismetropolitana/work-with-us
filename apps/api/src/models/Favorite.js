import { Dates } from '@tmlmobilidade/utils';
import mongoose from 'mongoose';

function toStartOfDayUTC(date) {
	const d = new Date(date);
	return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

const FavoriteSchema = new mongoose.Schema({
	createdAt: {
		default: () => toStartOfDayUTC(Dates.now().js_date),
		type: Date,
	},
	lineId: {
		required: true,
		type: String,
		unique: true,
	},
	longName: {
		required: true,
		type: String,
	},
	opDate: {
		default: () => toStartOfDayUTC(Dates.now().js_date),
		type: Date,
	},
});

export default mongoose.models.Favorite
  || mongoose.model('Favorite', FavoriteSchema);
