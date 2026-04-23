"use client";

import dynamic from "next/dynamic";
import { Spin } from "antd";

// Динамический импорт карты с отключенным SSR
const Map = dynamic(
  () => import("@/components/map/Map").then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-lg">
        <Spin size="large" />
      </div>
    ),
  },
);

export default function MapsPage() {
  return (
    <div className="h-full">
      <Map />
    </div>
  );
}
