'use client';

import { Search, X } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="absolute top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 sm:w-auto z-[1000]">
      <div className="relative bg-white rounded-xl shadow-2xl">
        <input
          type="text"
          placeholder="Buscar edificio, bloque..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 pl-11 sm:pl-12 pr-10 sm:pr-12 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-red-500 
                     bg-white text-gray-700 placeholder-gray-400
                     text-sm sm:text-base"
        />
        <Search 
          className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={18}
        />
        
        {/* Botón de limpiar */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 
                       p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full
                       active:bg-gray-200"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}