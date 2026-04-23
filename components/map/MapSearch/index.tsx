"use client";

import { useState } from "react";

interface MapSearchProps {
  onLocationChange: (location: { center: [number, number]; zoom: number }) => void;
  onSearchResult: (coordinates: [number, number] | null) => void;
}

export default function MapSearch({ onLocationChange, onSearchResult }: MapSearchProps) {
  const [inputValue, setInputValue] = useState("");

  const parseInput = async (value: string): Promise<{ center: [number, number]; zoom: number } | null> => {
    // Try to parse as coordinates (format: "lat,lon" or "lat lon" or "lat, lon")
    const coordMatch = value.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        return { center: [lon, lat], zoom: 12 };
      }
    }

    // If not coordinates, treat as address and use geocoding
    return geocodeAddress(value);
  };

  const geocodeAddress = async (address: string): Promise<{ center: [number, number]; zoom: number } | null> => {
    try {
      const ymaps3 = (window as any).ymaps3;
      if (!ymaps3) {
        alert("API Яндекс Карт не загружен.");
        return null;
      }

      // Load search module if not already loaded
      if (!ymaps3.search) {
        await ymaps3.import("@yandex/ymaps3-search");
      }

      const search = await ymaps3.search.search({ text: address });
      
      if (search && search.length > 0) {
        const firstResult = search[0];
        const coords = firstResult.geometry?.coordinates;
        if (coords && coords.length >= 2) {
          return { center: [coords[0], coords[1]] as [number, number], zoom: 12 };
        }
      }
      alert("Адрес не найден. Попробуйте другой запрос.");
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Ошибка при поиске адреса.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const parsed = await parseInput(inputValue);
    if (parsed) {
      onLocationChange(parsed);
      onSearchResult(parsed.center);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onSearchResult(null);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Координаты объекта"
            className="w-96 px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg"
        >
          Найти
        </button>
      </form>
    </div>
  );
}
