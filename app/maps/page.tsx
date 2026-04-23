"use client";

import dynamic from "next/dynamic";
import Header from "../../components/layout/Header";

// Динамический импорт карты с отключенным SSR
const MapComponent = dynamic(
  () => import("../../components/map/MapComponent").then((mod) => mod.MapComponent),
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
    <div className="flex flex-col h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex-1 w-full">
        <MapComponent />
      </main>
    </div>
  );
}
