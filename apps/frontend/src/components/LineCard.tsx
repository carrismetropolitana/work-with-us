'use client';

import { useState } from 'react';
import { Button, Text, Badge, Surface } from '@tmlmobilidade/ui';
import { Line } from '../types/line';
import { Heart, ExternalLink, Bus } from 'lucide-react';

interface LineCardProps {
  line: Line;
  isFavorite: boolean;
  onToggleFavorite: (line: Line) => Promise<void>;
}

export default function LineCard({ line, isFavorite, onToggleFavorite }: LineCardProps) {
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const handleCardClick = () => {
    const carrisUrl = `https://www.carrismetropolitana.pt/lines/${line.id}`;
    window.open(carrisUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingFavorite(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      await onToggleFavorite(line);
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const getFacilityColor = (facility: string) => {
    const colors: { [key: string]: string } = {
      train: 'bg-blue-100 text-blue-800 border-blue-200',
      subway: 'bg-green-100 text-green-800 border-green-200',
      school: 'bg-purple-100 text-purple-800 border-purple-200',
      transit_office: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[facility] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Surface 
      className="p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer mb-6 bg-white hover:bg-gray-50"
      onClick={handleCardClick}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg flex-shrink-0 border-2 border-white"
            style={{ backgroundColor: line.color, color: line.text_color }}
          >
            <Bus size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="primary" className="text-xs bg-gray-800 mb-4 text-white">
                  {line.id}
                </Badge>
              </div>
            </div>
            
            <Text variant="h4" className="font-semibold text-gray-800 mb-2 leading-tight">
              {line.long_name}
            </Text>
            
            <Text variant="body2" className="text-gray-600 mb-4">
              {line.tts_name}
            </Text>
            {line.facilities.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}> {/* container flex */}
                {line.facilities.map((facility, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-block',   
                      marginRight: '4px',        
                      marginBottom: '4px',   
                    }}
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs px-3 py-1 ${getFacilityColor(facility)}`}
                    >
                      {facility.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}






          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 lg:flex-col xl:flex-row lg:gap-2 flex-shrink-0">
          {/* Botão Favorito */}
          <Button
            variant="filled"
            size="sm"
            onClick={handleFavoriteClick}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className="min-w-[48px] flex items-center justify-center"
            style={{
              backgroundColor: isFavorite ? "#dc2626" : "#2563eb",
              color: "white",
              height: "48px",
              borderRadius: "8px",
              border: '1px solid #2563eb',
              margin: "2px",
              boxShadow: 'none', 
            }}
            leftSection={<Heart size={20} fill={isFavorite ? "white" : "none"} />}
            label={loadingFavorite ? "Atualizando..." : isFavorite ? "Favorito" : "Fav"}
          />

          {/* Botão Detalhes */}
          <Button
            variant="filled"
            size="sm"
            onClick={handleCardClick}
            title="Ver detalhes no site da Carris Metropolitana"
            className="min-w-[48px] flex items-center justify-center"
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              height: "48px",
              borderRadius: "8px",
              border: '1px solid #2563eb',
              margin: "2px",
              boxShadow: 'none', 
            }}
            leftSection={<ExternalLink size={16} />}
            label="Detalhes"
          />
        </div>
      </div>
    </Surface>
  );
}