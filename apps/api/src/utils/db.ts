import { MONGO_DB, MONGO_URI, MONGO_USER } from '@/consts.js';
import mongoose from 'mongoose';

export const connectDB = async () => {
	if (mongoose.connection.readyState >= 1) return;

	try {
		await mongoose.connect(MONGO_URI, {
			authSource: MONGO_USER,
			dbName: MONGO_DB,
		});

		console.log('MongoDB connected successfully');
	}
	catch (err) {
		console.error('MongoDB connection error:', err);
		process.exit(1);
	}
};
