import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { Dates } from '@tmlmobilidade/utils';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB - usando as configurações do compose.yml
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:root@localhost:37001/production?authSource=admin';
let db: any = null;

async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('production'); // Usando o database 'production' do compose.yml
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// API para buscar linhas da Carris
app.get('/api/lines', async (req, res) => {
  try {
    console.log('Fetching lines from Carris API...');
    const response = await fetch('https://api.carrismetropolitana.pt/v2/lines', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Carris API responded with status: ${response.status}`);
    }

    const lines = await response.json();
    console.log(`Fetched ${lines.length} lines from Carris API`);
    
    // Adicionar URL para cada linha
    const linesWithUrls = lines.map((line: any) => ({
      ...line,
      url: `https://www.carrismetropolitana.pt/linhas/${line.id}`
    }));

    res.json(linesWithUrls);
  } catch (error) {
    console.error('Error fetching lines:', error);
    res.status(500).json({ error: 'Failed to fetch lines from Carris Metropolitana API' });
  }
});

// API para buscar favoritos
app.get('/api/favorites', async (req, res) => {
  try {
    if (!db) throw new Error('Database not connected');
    
    const favorites = await db
      .collection('favorites')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Found ${favorites.length} favorites`);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// API para adicionar/remover favoritos
app.post('/api/favorites', async (req, res) => {
  try {
    const { lineId, lineData } = req.body;
    
    console.log('Received favorite toggle request:', { lineId });
    
    if (!lineId || !lineData) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Line ID and data are required' });
    }

    if (!db) {
      console.log('Database not connected');
      throw new Error('Database not connected');
    }

    // Verificar se já é favorito
    const existingFavorite = await db
      .collection('favorites')
      .findOne({ lineId });

    if (existingFavorite) {
      // Remover dos favoritos
      console.log(`Removing favorite: ${lineId}`);
      const result = await db.collection('favorites').deleteOne({ lineId });
      
      if (result.deletedCount === 0) {
        console.log('Failed to remove favorite');
        return res.status(500).json({ error: 'Failed to remove favorite' });
      }
      
      console.log(`Successfully removed favorite: ${lineId}`);
      return res.json({ success: true, action: 'removed' });
    }

    // Adicionar aos favoritos
    console.log(`Adding favorite: ${lineId}`);
    const now = new Date();
    const favorite = {
      lineId,
      ...lineData,
      createdAt: Math.floor(now.getTime() / 1000), 
      operationalDate: now.toISOString().split('T')[0] 
    };

    console.log('Favorite data to insert:', favorite);

    const result = await db
      .collection('favorites')
      .insertOne(favorite);

    if (!result.insertedId) {
      console.log('Failed to insert favorite');
      return res.status(500).json({ error: 'Failed to insert favorite' });
    }

    console.log(`Successfully added favorite: ${lineId}`);
    res.json({
      ...favorite,
      _id: result.insertedId,
      action: 'added'
    });
    
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ 
      error: 'Failed to toggle favorite',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db ? 'Connected' : 'Disconnected'
  });
});

// Rota de teste
app.get('/api/test', async (req, res) => {
  try {
    if (!db) throw new Error('Database not connected');
    
    // Testar a conexão com a base de dados
    const collections = await db.listCollections().toArray();
    res.json({
      message: 'API is working!',
      database: 'Connected',
      collections: collections.map((col: any) => col.name)
    });
  } catch (error) {
    res.status(500).json({
      message: 'API error',
      error: error.message
    });
  }
});

// Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`MongoDB: ${MONGODB_URI}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Test route: http://localhost:${PORT}/api/test`);
  });
});