import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:root@localhost:37001/production?authSource=admin';

export const connectDB = async () => {
	if (mongoose.connection.readyState >= 1) return;
	await mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log('🌱 MongoDB connected');
};
