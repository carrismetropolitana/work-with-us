import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Dates } from '@tmlmobilidade/utils';

const app = express();
app.use(cors());
app.use(express.json());

// Schema e Model de Favorito (dentro do ficheiro para garantir)
const FavoriteSchema = new mongoose.Schema({
  lineId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAtUnix: {
    type: Number,
    required: true,
    default: () => Dates.now('utc').unix_timestamp, // Usa a funcionalidade Dates da lib
  },
  operationalDate: {
    type: String,
    required: true,
    default: () => Dates.now('utc').operational_date, // Usa a funcionalidade Dates da lib
  },
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

// Rotas com logs para debug
app.get('/favorites', async (req, res) => {
  console.log('GET /favorites chamado');
  try {
    const favorites = await Favorite.find({});
    console.log('Favoritos encontrados:', favorites.map(f => f.lineId));
    res.json(favorites.map(f => f.lineId));
  } catch (err) {
    console.error('Erro no GET /favorites:', err);
    res.status(500).json({ error: 'Erro ao listar favoritos', details: err.message });
  }
});

app.post('/favorites', async (req, res) => {
  console.log('POST /favorites chamado com body:', req.body);
  const { lineId } = req.body;
  if (!lineId) {
    return res.status(400).json({ error: 'lineId obrigatório' });
  }

  try {
    const existing = await Favorite.findOne({ lineId });
    if (existing) {
      console.log('Linha já favoritada:', lineId);
      return res.json({ success: true });
    }

    const favorite = new Favorite({ lineId });
    await favorite.save();
    console.log('Favorito adicionado:', lineId);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro no POST /favorites:', err);
    res.status(500).json({ error: 'Erro ao adicionar favorito', details: err.message });
  }
});

app.delete('/favorites/:lineId', async (req, res) => {
  console.log('DELETE /favorites chamado para:', req.params.lineId);
  const { lineId } = req.params;
  try {
    const result = await Favorite.deleteOne({ lineId });
    console.log('Resultado delete:', result);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro no DELETE /favorites:', err);
    res.status(500).json({ error: 'Erro ao remover favorito', details: err.message });
  }
});

// Conexão ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/testdb')
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Inicia o server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});