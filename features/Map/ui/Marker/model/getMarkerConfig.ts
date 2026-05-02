import { MarkerFeature } from "../../../types";
import { SpecialTechniqueMarker } from "@/icons/SpecialTechniqueMarker";
import { GarbageCollectionMarker } from "@/icons/GarbageCollectionMarker";
import { ConstructionMarkerIcon } from "@/icons/ConstructionMarker";

type MarkerType = MarkerFeature["properties"]["type"];

interface MarkerConfig {
  Icon: React.ComponentType<{ color: string }>;
  offset: [number, number]; // смещение попапа
  color: {
    default: string;
    hover: string;
  };
}

const markerConfig: Record<MarkerType, MarkerConfig> = {
  garbageCollection: {
    Icon: GarbageCollectionMarker,
    offset: [0, -5],
    color: {
      default: "rgb(59, 179, 0)",
      hover: "rgb(255, 68, 51)",
    },
  },
  constructionSite: {
    Icon: ConstructionMarkerIcon,
    offset: [0, -10],
    color: {
      default: "rgb(255, 68, 51)",
      hover: "rgb(255, 68, 51)",
    },
  },
  specialTechnique: {
    Icon: SpecialTechniqueMarker,
    offset: [0, -7],
    color: {
      default: "rgb(59, 179, 0)",
      hover: "rgb(255, 68, 51)",
    },
  },
};

export function getMarkerConfig(type: MarkerType, isHovered: boolean) {
  const config = markerConfig[type] || markerConfig.specialTechnique;

  const color = isHovered
    ? config.color.hover
    : config.color.default;

  return {
    Icon: config.Icon,
    offset: config.offset,
    color,
  };
}