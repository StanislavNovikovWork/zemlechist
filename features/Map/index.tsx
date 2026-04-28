"use client";

import { useState, useRef } from "react";
import { Spin, message } from "antd";
import { DEFAULT_LOCATION } from "@/constants/map.constants";
import MapSearch from "./components/MapSearch";
import { MapContent } from "./components/MapContent";
import { FilterSidebar } from "./components/FilterSidebar";
import { MarkerFeature } from "./types";
import { useMarkersQuery } from "./hooks/queries/useMarkersQuery";
import { useUpdateMarkerMutation } from "./hooks/mutations/useUpdateMarkerMutation";
import { useDeleteMarkerMutation } from "./hooks/mutations/useDeleteMarkerMutation";
import { useSupplierDrawer } from "@/features/AddSupplierDrawer/hooks/useAddMarkerDrawer";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Пропсы компонента Map
 * @property location - Начальное расположение карты с координатами центра и уровнем масштаба
 */
interface MapProps {
  location?: { center: [number, number]; zoom: number };
}

export function Map({ location: propLocation = DEFAULT_LOCATION }: MapProps) {
  const queryClient = useQueryClient();
  const [location, setLocation] = useState(propLocation);
  const [clickMarker, setClickMarker] = useState<[number, number] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: markers, isLoading } = useMarkersQuery();
  const updateMarkerMutation = useUpdateMarkerMutation();
  const deleteMarkerMutation = useDeleteMarkerMutation();
  const addMarkerDrawer = useSupplierDrawer();

  // Filter markers based on selected type
  const filteredMarkers = markers && selectedType
    ? {
        ...markers,
        features: markers.features.filter((marker: MarkerFeature) => {
          const markerType = marker.properties.type;
          return markerType === selectedType;
        })
      }
    : markers;

  const handleLocationChange = (newLocation: { center: [number, number]; zoom: number }) => {
    setLocation(newLocation);
  };


  const handleMapClick = (coordinates: [number, number]) => {
    // Если маркер уже есть, удаляем его при клике в другое место
          setClickMarker(null);

    // if (clickMarker) {
    //   setClickMarker(null);
    // } else {
    //   setClickMarker(coordinates);
    // }
  };

  const handleOpenModal = (marker: MarkerFeature) => {
    addMarkerDrawer.open('view', {
      properties: marker.properties,
      onSave: (values: any) => handleSaveMarker(marker.id, values),
      onDelete: () => handleDeleteMarker(marker.id),
      deleteLoading: deleteMarkerMutation.isPending,
    });
  };

  const handleMarkerClick = (marker: MarkerFeature) => {
    // Перемещаем карту к маркеру
    setLocation({
      center: marker.geometry.coordinates,
      zoom: 14,
    });
    // Устанавливаем маркер как hovered для показа попапа
    setHoveredId(marker.id);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleAllTypesSelect = () => {
    setSelectedType(null);
  };

  const handleAddMarkerFromClick = () => {
    addMarkerDrawer.open(clickMarker, () => {
      setClickMarker(null);
      addMarkerDrawer.clearCoordinates();
    });
  };

  const handleCancelAddMarker = () => {
    setClickMarker(null);
  };

  const handleMouseEnter = (id: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 200);
  };

  const handleSaveMarker = async (markerId: number, values: any) => {
    updateMarkerMutation.mutate(
      { id: markerId, values },
      {
        onSuccess: async (data) => {
          message.success('Успешно');
          // Перезагружаем данные с сервера и ждем завершения
          await queryClient.refetchQueries({ queryKey: ['markers'] });
        },
        onError: (error) => {
          message.error('Ошибка при сохранении');
        },
      }
    );
  };

  const handleDeleteMarker = (markerId: number) => {
    deleteMarkerMutation.mutate(markerId, {
      onSuccess: () => {
        message.success('Маркер успешно удален');
      },
      onError: (error: any) => {
        message.error('Ошибка при удалении маркера');
      },
    });
  };

  return (
    <div className="w-full h-full flex">
      <FilterSidebar 
        onAddMarker={addMarkerDrawer.open}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        onTypeSelect={handleTypeSelect}
        onAllTypesSelect={handleAllTypesSelect}
      />
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <MapSearch onLocationChange={handleLocationChange} onMapClick={setClickMarker} />
            <MapContent
              location={location}
              markers={filteredMarkers}
              clickMarker={clickMarker}
              hoveredId={hoveredId}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              onOpenModal={handleOpenModal}
              onMapClick={handleMapClick}
              onAddMarker={handleAddMarkerFromClick}
              onCancelAddMarker={handleCancelAddMarker}
            />
          </>
        )}
      </div>
    </div>
  );
}
