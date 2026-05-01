"use client";

import dynamic from "next/dynamic";

// Динамический импорт карты с отключенным SSR
const Map = dynamic(
  () => import("@/features/Map").then((mod) => mod.Map),
  {
    ssr: false,
  },
);

export default function MapsPage() {
  return (
    <div className="h-screen">
      <Map />
    </div>
  );
}
