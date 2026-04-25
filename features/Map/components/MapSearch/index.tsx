"use client";

import { useState } from "react";
import { Input } from "antd";
import { parseCoordinates } from "@/lib/coordinateParser";

/**
 * Пропсы компонента MapSearch
 * @property onLocationChange - Callback при изменении расположения карты
 * @property onSearchResult - Callback при получении результата поиска с координатами
 */
interface MapSearchProps {
  onLocationChange: (location: { center: [number, number]; zoom: number }) => void;
  onSearchResult: (coordinates: [number, number] | null) => void;
}

export default function MapSearch({ onLocationChange, onSearchResult }: MapSearchProps) {
  const [error, setError] = useState("");

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    
    const parsed = parseCoordinates(value);
    if (parsed) {
      setError("");
      onLocationChange(parsed);
      onSearchResult(parsed.center);
    } else {
      setError("Используйте формат: широта, долгота (например: 55.376861,35.850685)");
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
      <div className="relative">
        <Input.Search
          placeholder="Координаты объекта"
          allowClear
          onSearch={handleSearch}
          onChange={() => setError("")}
          status={error ? "error" : undefined}
          style={{ width: 400 }}
          enterButton="Найти"
        />
        {error && (
          <div className="absolute top-full left-0 mt-1 text-red-500 text-xs whitespace-nowrap bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
