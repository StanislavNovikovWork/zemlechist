"use client";

import dynamic from "next/dynamic";

// Динамический импорт карты с отключенным SSR
const Map = dynamic(
  () => import("@/components/map/Map").then((mod) => mod.Map),
  {
    ssr: false,
  },
);

export default function MapsPage() {
  return (
    <div className="h-full">
      <Map />
    </div>
  );
}
