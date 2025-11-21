'use client';

import { useState, useEffect } from 'react';
import { Button, Text, Surface, ComponentWrapper } from '@tmlmobilidade/ui';
import { Line, Favorite } from '../types/line';
import { fetchLines, fetchFavorites, toggleFavorite } from '../lib/api';
import LineCard from './LineCard';

export default function LineList() {
  const [lines, setLines] = useState<Line[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [linesData, favoritesData] = await Promise.all([
        fetchLines(),
        fetchFavorites()
      ]);

      setLines(linesData);
      setFavorites(favoritesData);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar dados da Carris Metropolitana';
      setError(`${errorMessage}. Verifique se a API está rodando na porta 3001.`);
    } finally {
      setLoading(false);
    }
  };

    const handleToggleFavorite = async (line: Line) => {
    try {
        const result = await toggleFavorite(line);

        if (result.action === 'added' && result._id) {
        setFavorites(prev => [...prev, result as Favorite]);
        } else if (result.action === 'removed') {
        setFavorites(prev => prev.filter(fav => fav.lineId !== line.id));
        }
    } catch (err: any) {
        setError(`Erro ao atualizar favoritos: ${err.message}`);
    }
    };


  const handleTabChange = async (tab: string) => {
    if (tab === activeTab) return;

    setFilterLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveTab(tab);
    setFilterLoading(false);
  };

  const displayedLines = activeTab === 'favorites'
    ? lines.filter(line => favorites.some(fav => fav.lineId === line.id))
    : lines;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">A carregar linhas da Carris Metropolitana...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Surface className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <Text variant="h3" className="text-gray-800 mb-2">Erro</Text>
        <Text variant="body1" className="text-gray-700 mb-4">{error}</Text>

        <div className="space-y-2">
          <Button
            variant="filled"
            color="blue"
            c="white"
            onClick={loadData}
            name="botao-tentar-novamente"
            label="Tentar novamente"
          />

          <div className="text-sm text-gray-600">
            <p>Certifique-se de que:</p>
            <ul className="list-disc ml-4 mt-1">
              <li>A API está rodando na porta 3001</li>
              <li>O MongoDB está iniciado com Docker</li>
              <li>As URLs da API estão acessíveis</li>
            </ul>
          </div>
        </div>
      </Surface>
    );
  }

  return (
    <div className="space-y-6">
      <Text variant="h1" className="font-bold text-2xl text-white">
        Carris Metropolitana - Linhas
      </Text>

        <ComponentWrapper className="flex space-x-4 mb-4">
            <Button
                variant={activeTab === 'all' ? 'filled' : 'outline'}
                label={
                filterLoading && activeTab === 'all'
                    ? "A filtrar..."
                    : `Todas as Linhas (${lines.length})`
                }
                disabled={filterLoading}
                onClick={() => handleTabChange('all')}
                name="botao-todas-linhas"
                style={{
                backgroundColor: activeTab === 'all' ? "#2563eb" : "#2564eb84",
                color: "white",
                borderColor: "#2563eb",
                borderWidth: 1,
                margin: "2px",
                boxShadow: 'none', 
                }}
            />

            <Button
                variant={activeTab === 'favorites' ? 'filled' : 'outline'}
                label={
                filterLoading && activeTab === 'favorites'
                    ? "A filtrar..."
                    : `Favoritas (${favorites.length})`
                }
                disabled={filterLoading}
                onClick={() => handleTabChange('favorites')}
                name="botao-linhas-favoritas"
                style={{
                backgroundColor: activeTab === 'favorites' ? "#2563eb" : "#2564eb84",
                color: "white",
                borderColor: "#2563eb",
                borderWidth: 1,
                margin: "2px",
                boxShadow: 'none', 
                }}
            />

        </ComponentWrapper>


      {filterLoading && (
        <div className="flex justify-center items-center py-4 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <Text variant="body2" className="text-blue-700">
            A filtrar linhas...
          </Text>
        </div>
      )}

      {!filterLoading && (
        <div className="grid gap-4">
          {displayedLines.map(line => (
            <LineCard
              key={line.id}
              line={line}
              isFavorite={favorites.some(fav => fav.lineId === line.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {!filterLoading && activeTab === 'favorites' && favorites.length === 0 && (
        <Surface className="text-center py-12 text-gray-500">
          <Text variant="h3" className="mb-2 text-white">Nenhuma linha favoritada</Text>
          <Text variant="body2" className="text-white">Adicione linhas aos favoritos clicando no ícone</Text>
        </Surface>
      )}

      {!filterLoading && displayedLines.length === 0 && activeTab === 'all' && (
        <Surface className="text-center py-12 text-gray-500">
          <Text variant="h3" className="text-white">Nenhuma linha disponível</Text>
        </Surface>
      )}
    </div>
  );
}
