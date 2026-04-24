import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
} from "@/lib/ymaps3";
import { Marker } from "../Marker";
import { MarkerFeature, MarkersGeoJSON } from "../../types";

/**
 * Пропсы компонента MapContent
 * @property location - Расположение карты с координатами центра и уровнем масштаба
 * @property markers - Массив маркеров для отображения
 * @property searchMarker - Координаты временного маркера поиска
 * @property hoveredId - ID маркера с наведенным курсором
 * @property handleMouseEnter - Callback при наведении курсора на маркер
 * @property handleMouseLeave - Callback при уходе курсора с маркера
 * @property onOpenModal - Callback при клике на маркер для открытия модального окна
 */
interface MapContentProps {
  location: { center: [number, number]; zoom: number };
  markers: MarkersGeoJSON | null;
  searchMarker: [number, number] | null;
  hoveredId: number | null;
  handleMouseEnter: (id: number) => void;
  handleMouseLeave: () => void;
  onOpenModal: (marker: MarkerFeature) => void;
}

export function MapContent({
  location,
  markers,
  searchMarker,
  hoveredId,
  handleMouseEnter,
  handleMouseLeave,
  onOpenModal,
}: MapContentProps) {
  return (
    <YMap location={location}>
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      {searchMarker && (
        <YMapMarker coordinates={searchMarker} zIndex={2000}>
          <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md" />
        </YMapMarker>
      )}
      {markers?.features?.map((feature: MarkerFeature) => (
        <Marker
          key={feature.id}
          feature={feature}
          isHovered={hoveredId === feature.id}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onOpenModal={onOpenModal}
        />
      ))}
    </YMap>
  );
}
