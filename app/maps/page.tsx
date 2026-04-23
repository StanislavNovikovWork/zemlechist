"use client";

import dynamic from "next/dynamic";

// Динамический импорт карты с отключенным SSR
const MapComponent = dynamic(
  () => import("@/components/map/MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-lg">
        <div className="text-gray-500">Загрузка карты...</div>
      </div>
    ),
  },
);

export default function MapsPage() {
  return (
    <div className="h-full">
      <MapComponent />
    </div>
  );
}
