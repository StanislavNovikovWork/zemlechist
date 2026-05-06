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
  const [selectedTypes, setSelectedTypes] = useState<string[] | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: markers, isLoading } = useMarkersQuery();
  const { openCreateSupplier, openViewSupplier } = useSupplierDrawerController();

  // Filter markers based on selected types
  const allConstructionSiteMarkers = markers?.features?.filter((marker: MarkerFeature) => marker.properties.type === 'constructionSite') || [];
  const filteredByTypes = selectedTypes && selectedTypes.length > 0
    ? markers?.features?.filter((marker: MarkerFeature) => selectedTypes.includes(marker.properties.type)) || []
    : [];
  
  // Always include construction sites + filtered markers (without duplicates)
  const filteredMarkers = [...allConstructionSiteMarkers, ...filteredByTypes.filter((marker: MarkerFeature) => marker.properties.type !== 'constructionSite')];

  // Разделяем маркеры на constructionSite и остальные
  const constructionSiteMarkers = filteredMarkers.filter((marker: MarkerFeature) => marker.properties.type === 'constructionSite');
  const otherMarkers = filteredMarkers.filter((marker: MarkerFeature) => marker.properties.type !== 'constructionSite');

  const filteredGeoJSON = {
    type: 'FeatureCollection' as const,
    features: filteredMarkers,
  };

  const constructionSiteGeoJSON = {
    type: 'FeatureCollection' as const,
    features: constructionSiteMarkers,
  };

  const otherMarkersGeoJSON = {
    type: 'FeatureCollection' as const,
    features: otherMarkers,
  };

  const handleLocationChange = (newLocation: { center: [number, number]; zoom: number }) => {
    setLocation(newLocation);
  };


  const handleMapClick = () => {
    setClickMarker(null);
  };

  const handleOpenModal = (marker: MarkerFeature) => {
    if (marker.properties.type === 'constructionSite') {
      const constructionSiteForm = {
        id: marker.id,
        coordinates: marker.geometry.coordinates,
        type: 'constructionSite' as const,
        orderNumber: marker.properties.orderNumber,
        responsible: marker.properties.responsible,
        paymentMethod: marker.properties.paymentMethod as 'cash' | 'cashless' | 'both' | undefined,
        phone: '',
        name: '',
        description: '',
        iconCaption: '',
        'marker-color': '',
      };
      openViewSupplier(constructionSiteForm);
      return;
    }
    const supplierForm = {
      id: marker.id,
      phone: marker.properties.phone || '',
      name: marker.properties.name || '',
      description: marker.properties.description || '',
      iconCaption: marker.properties.iconCaption || '',
      'marker-color': marker.properties['marker-color'] || '',
      coordinates: marker.geometry.coordinates,
      type: marker.properties.type as 'specialTechnique' | 'garbageCollection',
      website: marker.properties.website,
      inn: marker.properties.inn,
      organizationName: marker.properties.organizationName,
      updatedAt: marker.properties.updatedAt,
      email: marker.properties.email,
      reliability: marker.properties.reliability,
      paymentMethod: marker.properties.paymentMethod as 'cash' | 'cashless' | 'both' | undefined,
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

  const handleFilterChange = (types: string[] | null) => {
    setSelectedTypes(types);
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
        onFilterChange={handleFilterChange}
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
              constructionSiteMarkers={constructionSiteGeoJSON}
              otherMarkers={otherMarkersGeoJSON}
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
