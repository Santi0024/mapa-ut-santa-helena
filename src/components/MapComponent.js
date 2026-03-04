'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBar from './SearchBar';
import edificiosData from '../data/edificios.json';

// Iconos por categoría
const iconosPorTipo = {
  academico: L.icon({
    iconUrl: '/pin-rojo.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  servicio: L.icon({
    iconUrl: '/pin-verde.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  deportivo: L.icon({
    iconUrl: '/pin-azul.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  administrativo: L.icon({
    iconUrl: '/pin-naranja.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  cultural: L.icon({
    iconUrl: '/pin-morado.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
};

// Colores por categoría para el popup
const coloresPorTipo = {
  academico: 'text-red-700',
  servicio: 'text-green-700',
  deportivo: 'text-blue-700',
  administrativo: 'text-orange-700',
  cultural: 'text-purple-700'
};

export default function MapComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar edificios según la búsqueda
  const edificiosFiltrados = edificiosData.filter((edificio) =>
    edificio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edificio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edificio.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative h-screen">
      {/* Barra de Búsqueda Flotante */}
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      {/* Contador de resultados */}
      {searchTerm && (
        <div className="absolute top-36 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md">
          <span className="text-sm text-gray-600">
            {edificiosFiltrados.length} resultado{edificiosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Leyenda de colores */}
      <div className="absolute bottom-20 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md">
        <p className="text-xs font-bold text-gray-700 mb-1">Leyenda:</p>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            <span>Académico</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            <span>Servicios</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            <span>Deportes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
            <span>Administrativo</span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer 
        center={[4.427647, -75.213342]}
        zoom={18}
        minZoom={18}
        maxZoom={18}
        maxBounds={[
          [4.425299, -75.218309],
          [4.429995, -75.208191]
        ]}
        maxBoundsViscosity={0.5}
        style={{ height: "100vh", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          maxZoom={18}
        />
        
        {edificiosFiltrados.map((edificio) => (
          <Marker 
            key={edificio.id} 
            position={edificio.coord}
            icon={iconosPorTipo[edificio.tipo] || iconosPorTipo.academico}
          >
            <Popup>
              <div className="text-center min-w-[220px]">
                <h3 className={`font-bold text-lg ${coloresPorTipo[edificio.tipo]}`}>
                  {edificio.nombre}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{edificio.descripcion}</p>
                <div className="mt-2 space-y-1">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                    📍 {edificio.tipo}
                  </span>
                  <br />
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                    🕐 {edificio.horario}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}