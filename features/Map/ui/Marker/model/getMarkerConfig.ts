import { MarkerFeature } from "../../../types";
import { SpecialTechniqueMarker } from "@/icons/SpecialTechniqueMarker";
import { GarbageCollectionMarker } from "@/icons/GarbageCollectionMarker";
import { ConstructionMarkerIcon } from "@/icons/ConstructionMarker";
import dayjs from 'dayjs';

type MarkerType = MarkerFeature["properties"]["type"];

interface MarkerConfig {
  Icon: React.ComponentType<{ color: string; hasGoldBorder?: boolean }>;
  offset: [number, number]; // смещение попапа
  color: {
    default: string;
  };
  scale: {
    default: number;
    hover: number;
  };
}

/**
 * Проверяет, просрочены ли все периоды продолжительности стройплощадки
 * @param duration - Объект с периодами продолжительности
 * @returns true если все периоды просрочены, иначе false
 */
function isConstructionSiteExpired(duration?: { period1?: string[]; period2?: string[] }): boolean {
  if (!duration) return false;
  
  const now = dayjs();
  let hasActivePeriod = false;
  
  // Проверяем первый период
  if (duration.period1 && duration.period1.length === 2) {
    const endDate = dayjs(duration.period1[1], 'DD.MM.YYYY');
    const dayDiff = endDate.diff(now, 'day');
    if (endDate.isValid() && (now.isBefore(endDate) || dayDiff === 0)) {
      hasActivePeriod = true;
    }
  }
  
  // Проверяем второй период
  if (!hasActivePeriod && duration.period2 && duration.period2.length === 2) {
    const endDate = dayjs(duration.period2[1], 'DD.MM.YYYY');
    const dayDiff = endDate.diff(now, 'day');
    if (endDate.isValid() && (now.isBefore(endDate) || dayDiff === 0)) {
      hasActivePeriod = true;
    }
  }
  
  // Если нет активных периодов, значит стройплощадка просрочена
  return !hasActivePeriod;
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
      default: "#f43", // orange из FilterCard
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
      default: "#1890ff", // синий как в Ant Design кнопках
    },
    scale: {
      default: 1,
      hover: 1.2, // небольшое увеличение при наведении
    },
  },
};

export function getMarkerConfig(type: MarkerType, isHovered: boolean, feature?: MarkerFeature) {
  const config = markerConfig[type] || markerConfig.specialTechnique;

  let color = config.color.default;
  
  // Для стройплощадок проверяем, не просрочены ли периоды
  if (type === 'constructionSite' && feature?.properties.duration) {
    const isExpired = isConstructionSiteExpired(feature.properties.duration);
    if (isExpired) {
      color = '#999999'; // серый цвет для просроченных стройплощадок
    }
  }
  
  const scale = isHovered ? config.scale.hover : config.scale.default;
  const hasGoldBorder = feature?.properties.reliability === 5;

  return {
    Icon: config.Icon,
    offset: config.offset,
    color,
    scale,
    hasGoldBorder,
  };
}