"use client";

import { useState, useRef } from "react";
import { Spin } from "antd";
import { DEFAULT_LOCATION } from "@/constants/map.constants";
import MapSearch from "./components/MapSearch";
import { MapContent } from "./components/MapContent";
import { FilterSidebar } from "./components/FilterSidebar";
import { MarkerFeature } from "./types";
import { useMarkersQuery } from "./hooks/queries/useMarkersQuery";
import { useUpdateMarkerMutation } from "./hooks/mutations/useUpdateMarkerMutation";
import { MarkerEditForm } from "./components/MarkerEditForm";
import { AppDrawer } from "@/components/ui/AppDrawer";
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
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['specialTechnique', 'garbageCollection']);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: markers, isLoading } = useMarkersQuery();
  const updateMarkerMutation = useUpdateMarkerMutation();

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

  const handleSearchResult = (coordinates: [number, number] | null) => {
    setSearchMarker(coordinates);
  };

  const handleOpenModal = (marker: MarkerFeature) => {
    setSelectedMarker(marker);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMarker(null);
    setIsEditing(false);
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
      }
    );
  };

  return (
    <div className="w-full h-full flex">
      <FilterSidebar selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <MapSearch onLocationChange={handleLocationChange} onSearchResult={handleSearchResult} />
            <MapContent
              location={location}
              markers={filteredMarkers}
              searchMarker={searchMarker}
              hoveredId={hoveredId}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              onOpenModal={handleOpenModal}
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
          />
        )}
      </AppDrawer>
    </div>
  );
}
