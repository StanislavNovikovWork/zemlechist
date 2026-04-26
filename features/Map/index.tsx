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
import { useAddMarkerDrawer } from "@/features/AddMarkerDrawer/hooks/useAddMarkerDrawer";
import { MarkerEditForm } from "./components/MarkerEditForm";
import { AppDrawer } from "@/ui/AppDrawer";
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
  const [selectedMarker, setSelectedMarker] = useState<MarkerFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [clickMarker, setClickMarker] = useState<[number, number] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['specialTechnique', 'garbageCollection']);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: markers, isLoading } = useMarkersQuery();
  const updateMarkerMutation = useUpdateMarkerMutation();
  const deleteMarkerMutation = useDeleteMarkerMutation();
  const addMarkerDrawer = useAddMarkerDrawer();

  // Filter markers based on selected types
  const filteredMarkers = markers && selectedTypes.length > 0
    ? {
        ...markers,
        features: markers.features.filter((marker: MarkerFeature) => {
          const markerType = marker.properties.type;
          return selectedTypes.includes(markerType);
        })
      }
    : markers;

  const handleLocationChange = (newLocation: { center: [number, number]; zoom: number }) => {
    setLocation(newLocation);
  };


  const handleMapClick = (coordinates: [number, number]) => {
    // Если маркер уже есть, удаляем его при клике в другое место
    if (clickMarker) {
      setClickMarker(null);
    } else {
      setClickMarker(coordinates);
    }
  };

  const handleOpenModal = (marker: MarkerFeature) => {
    setSelectedMarker(marker);
    setIsEditing(false);
    setIsModalOpen(true);
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

  const handleSaveMarker = (values: any) => {
    if (!selectedMarker) return;

    updateMarkerMutation.mutate(
      { id: selectedMarker.id, values },
      {
        onSuccess: (data) => {
          message.success('Успешно');
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: ['markers'] });
          setSelectedMarker({
            ...selectedMarker,
            properties: {
              ...selectedMarker.properties,
              phone: data.phone,
              name: data.name,
              description: data.description,
            },
          });
        },
        onError: (error) => {
          message.error('Ошибка при сохранении');
        },
      }
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMarker(null);
    setIsEditing(false);
  };

  const handleDeleteMarker = () => {
    if (!selectedMarker) return;

    deleteMarkerMutation.mutate(selectedMarker.id, {
      onSuccess: () => {
        message.success('Маркер успешно удален');
        setIsModalOpen(false);
        setSelectedMarker(null);
      },
      onError: (error: any) => {
        message.error('Ошибка при удалении маркера');
      },
    });
  };

  return (
    <div className="w-full h-full flex">
      <FilterSidebar selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} onAddMarker={addMarkerDrawer.open} />
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <MapSearch onLocationChange={handleLocationChange} onMapClick={handleMapClick} />
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
      <AppDrawer
        title="Информация о маркере"
        placement="right"
        open={isModalOpen}
        onClose={handleCloseModal}
        size="default"
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
      >
        {selectedMarker && (
          <MarkerEditForm
            properties={selectedMarker.properties}
            isEditing={isEditing}
            onSave={handleSaveMarker}
            onCancel={() => setIsEditing(false)}
            loading={updateMarkerMutation.isPending}
            onDelete={handleDeleteMarker}
            deleteLoading={deleteMarkerMutation.isPending}
          />
        )}
      </AppDrawer>
    </div>
  );
}
