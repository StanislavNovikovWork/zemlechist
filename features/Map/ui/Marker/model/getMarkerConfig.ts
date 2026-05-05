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
  };
  scale: {
    default: number;
    hover: number;
  };
}

const markerConfig: Record<MarkerType, MarkerConfig> = {
  garbageCollection: {
    Icon: GarbageCollectionMarker,
    offset: [0, -5],
    color: {
      default: "#52c41a", // green из FilterCard
    },
    scale: {
      default: 1,
      hover: 1.2, // небольшое увеличение при наведении
    },
  },
  constructionSite: {
    Icon: ConstructionMarkerIcon,
    offset: [0, -10],
    color: {
      default: "#fa8c16", // orange из FilterCard
    },
    scale: {
      default: 1,
      hover: 1.2, // небольшое увеличение при наведении
    },
  },
  specialTechnique: {
    Icon: SpecialTechniqueMarker,
    offset: [0, -7],
    color: {
      default: "#1890ff", // blue из FilterCard
    },
    scale: {
      default: 1,
      hover: 1.2, // небольшое увеличение при наведении
    },
  },
};

export function getMarkerConfig(type: MarkerType, isHovered: boolean) {
  const config = markerConfig[type] || markerConfig.specialTechnique;

  const color = config.color.default;
  const scale = isHovered ? config.scale.hover : config.scale.default;

  return {
    Icon: config.Icon,
    offset: config.offset,
    color,
    scale,
  };
}