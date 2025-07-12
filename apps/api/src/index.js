import cors from 'cors';
import express from 'express';

import favoritesRouter from './models/routes/favorites.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/favorites', favoritesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`🚀 API running at http://localhost:${PORT}`);
});
