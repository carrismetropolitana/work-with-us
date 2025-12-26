'use client';

import { useEffect, useState } from 'react';
import { Button } from '@tmlmobilidade/ui';

type Line = {
  id: string;
  short_name: string;
  long_name: string;
};

export default function LinesList() {
  const [lines, setLines] = useState<Line[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Carrega linhas e favoritos
  useEffect(() => {
	// Linhas da API pública
	fetch('https://api.carrismetropolitana.pt/v2/lines')
	  .then(res => res.json())
	  .then(data => setLines(data))
	  .catch(err => console.error('Erro ao carregar linhas:', err));

	// Favoritos do backend
	loadFavorites();
	setLoading(false);
  }, []);

  // Função separada para carregar favoritos
  const loadFavorites = () => {
	fetch('http://localhost:3001/favorites')
	  .then(res => {
		if (!res.ok) {
		  console.error('Erro HTTP ao carregar favoritos:', res.status);
		  throw new Error(`HTTP ${res.status}`);
		}
		return res.json();
	  })
	  .then(data => {
		console.log('Favoritos carregados com sucesso:', data);
		setFavorites(data);
	  })
	  .catch(err => {
		console.error('Falha ao carregar favoritos:', err);
		setFavorites([]);
	  });
  };

  // Toggle favorito com loading e recarrega lista após sucesso
  const toggleFavorite = async (lineId: string) => {
	setLoadingFavorites(true);

	try {
	  if (favorites.includes(lineId)) {
		// Remover
		const res = await fetch(`http://localhost:3001/favorites/${lineId}`, { method: 'DELETE' });
		if (!res.ok) throw new Error('Erro ao remover');
	  } else {
		// Adicionar
		const res = await fetch('http://localhost:3001/favorites', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ lineId }),
		});
		if (!res.ok) throw new Error('Erro ao adicionar');
	  }

	  // Recarrega os favoritos do backend após sucesso
	  loadFavorites();
	} catch (err) {
	  console.error('Erro no toggle:', err);
	  alert('Erro ao atualizar favorito. Verifica o console.');
	} finally {
	  setLoadingFavorites(false);
	}
  };

  return (
	<div style={{ padding: '40px' }}>
	  <h1 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
		Linhas da Carris Metropolitana
	  </h1>

	  <div style={{ display: 'grid', gap: '20px' }}>
		{lines.map(line => (
		  <div
			key={line.id}
			style={{
			  border: '1px solid #ddd',
			  borderRadius: '8px',
			  padding: '20px',
			  backgroundColor: '#fff',
			  display: 'flex',
			  alignItems: 'center',
			  justifyContent: 'space-between',
			  gap: '16px',
			}}
		  >
			<div style={{ flex: 1 }}>
			  <strong style={{ fontSize: '24px' }}>{line.short_name}</strong>
			  <p style={{ margin: '8px 0' }}>{line.long_name}</p>
			  <Button
				onClick={() => window.open(`https://carrismetropolitana.pt/lines/${line.id}`, '_blank')}
			  >
				Ver no site oficial
			  </Button>
			</div>

			<button
			  onClick={() => toggleFavorite(line.id)}
			  disabled={loadingFavorites}
			  style={{
				background: 'none',
				border: 'none',
				fontSize: '28px',
				cursor: loadingFavorites ? 'not-allowed' : 'pointer',
				opacity: loadingFavorites ? 0.5 : 1,
			  }}
			>
			  {favorites.includes(line.id) ? '❤️' : '♡'}
			</button>
		  </div>
		))}
	  </div>
	</div>
  );
}