"use client";

import { useState, useRef } from "react";
import { Spin } from "antd";
import { DEFAULT_LOCATION } from "@/constants/map.constants";
import MapSearch from "./ui/MapSearch";
import { MapContent } from "./ui/MapContent";
import { FilterSidebar } from "./ui/FilterSidebar";
import { MarkerFeature } from "./types";
import { useMarkersQuery } from "./hooks/queries/useMarkersQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSupplierDrawerController } from "../SupplierDrawerControll/model/supplierDrawer.store";

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
  const { openCreateSupplier, openViewSupplier } = useSupplierDrawerController();

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


  const handleMapClick = () => {
    setClickMarker(null);
  };

  const handleOpenModal = (marker: MarkerFeature) => {
    const supplierForm = {
      id: marker.id,
      ...marker.properties,
      coordinates: marker.geometry.coordinates,
      type: marker.properties.type as 'specialTechnique' | 'garbageCollection',
    };
    openViewSupplier(supplierForm);
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


  return (
    <div className="w-full h-full flex">
      <FilterSidebar 
        onAddMarker={openCreateSupplier}
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
              onAddMarker={openCreateSupplier}
              onCancelAddMarker={handleCancelAddMarker}
            />
          </>
        )}
      </div>
    </div>
  );
}
