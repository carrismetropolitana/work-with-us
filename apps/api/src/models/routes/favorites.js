import express from 'express';
import mongoose from 'mongoose';

import { connectDB } from '../../db.js';
import Favorite from '../Favorite.js';

const router = express.Router();
await connectDB();

// POST
router.post('/', async (req, res) => {
	try {
		const { lineId, longName } = req.body;
		const fav = await Favorite.create({ lineId, longName });
		return res.status(201).json(fav);
	}
	catch (err) {
		console.error(err);
		return res.status(400).json({ message: err.message });
	}
});

// GET
router.get('/', async (_req, res) => {
	const list = await Favorite.find().sort({ createdAt: -1 });
	res.json(list);
});

// DELETE
router.delete('/:id', async (req, res) => {
	console.log('[DELETE] got id:', req.params.id);
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid ID format' });
		}

		const deleted = await Favorite.findByIdAndDelete(id);

		if (!deleted) {
			return res.status(404).json({ error: 'Favorite not found' });
		}

		res.status(200).json({ id, message: 'Favorite removed' });
	}
	catch (err) {
		res.status(500).json({ error: 'Server error' });
	}
});

export default router;
