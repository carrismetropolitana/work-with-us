import mongoose, { Document, Model } from 'mongoose';

interface FavoriteDocument extends Document {
	createdAt: number
	lineId: string
	operationalDate: string
}

const FavoriteSchema = new mongoose.Schema<FavoriteDocument>({
	createdAt: { required: true, type: Number },
	lineId: { required: true, type: String, unique: true },
	operationalDate: { required: true, type: String },
});

const FavoriteModel: Model<FavoriteDocument>
  = mongoose.models.Favorite || mongoose.model<FavoriteDocument>('Favorite', FavoriteSchema);

export default FavoriteModel;
