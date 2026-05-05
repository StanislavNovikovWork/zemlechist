import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapListener,
  YMapClusterer,
  clusterByGrid,
  YMapFeature,
} from "@/lib/ymaps3";
import { Marker } from "../Marker";
import { ClickMarker } from "../ClickMarker";
import { MarkerFeature, MarkersGeoJSON } from "../../types";
import { useMemo, useCallback } from "react";

/**
 * Пропсы компонента MapContent
 * @property location - Расположение карты с координатами центра и уровнем масштаба
 * @property constructionSiteMarkers - Массив маркеров строй площадок для отображения (без кластеризации)
 * @property otherMarkers - Массив остальных маркеров для отображения (с кластеризацией)
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
  constructionSiteMarkers: MarkersGeoJSON | null;
  otherMarkers: MarkersGeoJSON | null;
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
  constructionSiteMarkers,
  otherMarkers,
  clickMarker,
  hoveredId,
  handleMouseEnter,
  handleMouseLeave,
  onOpenModal,
  onMapClick,
  onAddMarker,
  onCancelAddMarker,
}: MapContentProps) {
  const gridSizedMethod = useMemo(() => clusterByGrid({ gridSize: 64 }), []);
  
  // Координаты полигона Московской области
//   const POLYGONS_COORDINATES = [
//     [
//       [36.50, 56.05],  // северо-запад (район Твери)
//       [37.80, 56.10],  // север (Дубна)
//       [39.20, 56.00],  // северо-восток (Александров)
//       [39.50, 55.40],  // восток (Орехово-Зуево)
//       [39.30, 54.90],  // юго-восток (Коломна)
//       [38.80, 54.70],  // юг (Ступино)
//       [37.80, 54.60],  // юг (Серпухов)
//       [36.80, 54.70],  // юго-запад (Калуга обл)
//       [36.40, 55.20],  // запад
//       [36.30, 55.60],  // северо-запад (Волоколамск)
//       [36.50, 56.05],  // замыкание полигона
//     ]
//   ];

//   const POLYGON_STYLE = {
//     stroke: [
//         {
//             color: '#196DFF99',
//             width: 3
//         }
//     ],
//     fill: '#196DFF14'
// };

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
        <YMapDefaultSchemeLayer 
      // customization={[
      //   {
      //     "stylers": [
      //       {
      //         "saturation": -1
      //       }
      //     ]
      //   }
      // ]}
    />
        <YMapDefaultFeaturesLayer />

      {/* Полигоны */}
      {/* {POLYGONS_COORDINATES.map((polygonCoords, index) => (
        <YMapFeature
          key={`polygon-${index}`}
          geometry={{
            type: 'Polygon',
            coordinates: [polygonCoords]
          }}
          style={POLYGON_STYLE}
        />
      ))} */}
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
      {/* Слой строй площадок - без кластеризации, с наивысшим z-index */}
      {constructionSiteMarkers?.features?.map((feature: MarkerFeature) => (
        <Marker
          key={feature.id}
          feature={feature}
          isHovered={hoveredId === feature.id}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onOpenModal={onOpenModal}
        />
      ))}
      
      {/* Слой остальных маркеров - с кластеризацией */}
      {otherMarkers?.features && (
        <YMapClusterer
          marker={marker}
          cluster={cluster}
          method={gridSizedMethod}
          features={otherMarkers.features}
          maxZoom={14}
        />
      )}
    </YMap>
  );
}
