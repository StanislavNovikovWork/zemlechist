import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapListener,
} from "@/lib/ymaps3";
import { Marker } from "../Marker";
import { ClickMarker } from "../ClickMarker";
import { MarkerFeature, MarkersGeoJSON } from "../../types";

/**
 * Пропсы компонента MapContent
 * @property location - Расположение карты с координатами центра и уровнем масштаба
 * @property markers - Массив маркеров для отображения
 * @property clickMarker - Координаты временного маркера при клике на карту
 * @property hoveredId - ID маркера с наведенным курсором
 * @property handleMouseEnter - Callback при наведении курсора на маркер
 * @property handleMouseLeave - Callback при уходе курсора с маркера
 * @property onOpenModal - Callback при клике на маркер для открытия модального окна
 * @property onMapClick - Callback при клике на карту
 * @property onAddMarker - Callback при клике на кнопку "Добавить точку"
 * @property onCancelAddMarker - Callback при клике на крестик для отмены добавления маркера
 */
interface MapContentProps {
  location: { center: [number, number]; zoom: number };
  markers: MarkersGeoJSON | null;
  clickMarker: [number, number] | null;
  hoveredId: number | null;
  handleMouseEnter: (id: number) => void;
  handleMouseLeave: () => void;
  onOpenModal: (marker: MarkerFeature) => void;
  onMapClick: (coordinates: [number, number]) => void;
  onAddMarker: () => void;
  onCancelAddMarker: () => void;
}

export function MapContent({
  location,
  markers,
  clickMarker,
  hoveredId,
  handleMouseEnter,
  handleMouseLeave,
  onOpenModal,
  onMapClick,
  onAddMarker,
  onCancelAddMarker,
}: MapContentProps) {
  return (
    <YMap location={location}>
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      <YMapListener 
        layer="any"
        onClick={(object: any, event: any) => {
          if (event?.coordinates) {
            onMapClick(event.coordinates);
          }
        }}
      />
      {clickMarker && (
        <ClickMarker
          coordinates={clickMarker}
          onAddMarker={onAddMarker}
          onCancelAddMarker={onCancelAddMarker}
        />
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
