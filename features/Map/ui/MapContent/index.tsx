import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapListener,
  YMapClusterer,
  clusterByGrid,
} from "@/lib/ymaps3";
import { Marker } from "../Marker";
import { ClickMarker } from "../ClickMarker";
import { MarkerFeature, MarkersGeoJSON } from "../../types";
import { useMemo, useCallback } from "react";

/**
 * Пропсы компонента MapContent
 * @property location - Расположение карты с координатами центра и уровнем масштаба
 * @property markers - Массив маркеров для отображения
 * @property clickMarker - Координаты временного маркера при клике на карту
 * @property hoveredId - ID маркера с наведенным курсором
 * @property handleMouseEnter - Callback при наведении курсора на маркер
 * @property handleMouseLeave - Callback при уходе курсора с маркера
 * @property onOpenModal - Callback при клике на маркер для открытия модального окна просмотра
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
  const gridSizedMethod = useMemo(() => clusterByGrid({ gridSize: 32 }), []);

  const marker = useCallback(
    (feature: MarkerFeature) => (
      <Marker
        key={feature.id}
        feature={feature}
        isHovered={hoveredId === feature.id}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onOpenModal={onOpenModal}
      />
    ),
    [hoveredId, handleMouseEnter, handleMouseLeave, onOpenModal]
  );

  const cluster = useCallback(
    (coordinates: [number, number], features: MarkerFeature[]) => (
      <YMapMarker coordinates={coordinates}>
        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
          {features.length}
        </div>
      </YMapMarker>
    ),
    []
  );

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
      {markers?.features && (
        <YMapClusterer
          marker={marker}
          cluster={cluster}
          method={gridSizedMethod}
          features={markers.features}
          maxZoom={16}
        />
      )}
    </YMap>
  );
}
