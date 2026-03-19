// src/components/03-organisms/MapSelector/index.tsx
//
// Organismo SMART — llama a GET /maps y renderiza las MapCards
// El usuario selecciona un mapa antes de entrar al combate

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MapCard } from '../../02-molecules/MapCard';

// ── Tipo que viene del backend GET /maps ──────────────────────
export interface MapFromAPI {
  id:              string;
  name:            string;
  levelRange:      string;  // '1 - 40'
  description:     string;
  backgroundTheme: string;
  monsters:        object[];
}

export interface MapSelectorProps {
  apiUrl?:       string;
  activeMapId?:  string;
  onSelectMap?:  (map: MapFromAPI) => void;
}

export function MapSelector({
  apiUrl      = 'http://localhost:3000',
  activeMapId,
  onSelectMap,
}: MapSelectorProps) {

  const [maps,    setMaps]    = useState<MapFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/maps`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: MapFromAPI[]) => {
        setMaps(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <View style={{ padding: 24, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#c9a84c" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, color: '#c0392b', letterSpacing: 2 }}>
          ERROR LOADING MAPS
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: '#050508', paddingVertical: 16, paddingHorizontal: 16 }}>

      {/* Título de sección */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 5, color: '#c9a84c' }}>
          SELECT YOUR MAP
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
      </View>

      {/* Fila horizontal de mapas */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {maps.map(map => (
          <MapCard
            key={map.id}
            id={map.id}
            name={map.name}
            levelRange={map.levelRange}
            isActive={map.id === activeMapId}
            onPress={() => onSelectMap?.(map)}
          />
        ))}
      </View>
    </View>
  );
}