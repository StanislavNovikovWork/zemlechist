"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Spin } from "antd";
import { DEFAULT_LOCATION } from "@/constants/map.constants";
import MapSearch from "./ui/MapSearch";
import { MapContent } from "./ui/MapContent";
import { FilterSidebar } from "./ui/FilterSidebar";
import { ZoneFilter } from "./ui/ZoneFilter";
import { MarkerFeature } from "./types";
import { useMarkersQuery } from "./hooks/queries/useMarkersQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSupplierDrawerController } from "../SupplierDrawerControll/model/supplierDrawer.store";
import dayjs from 'dayjs';

/**
 * Checks whether today's date falls within a single period (start-end inclusive).
 */
function isTodayInPeriod(period: string[]): boolean {
  if (!period || period.length < 2) return false;
  const start = dayjs(period[0], 'DD.MM.YYYY');
  const end = dayjs(period[1], 'DD.MM.YYYY');
  const today = dayjs();
  if (!start.isValid() || !end.isValid()) return false;
  return today.isSame(start, 'day') || today.isSame(end, 'day') || (today.isAfter(start, 'day') && today.isBefore(end, 'day'));
}

/**
 * Checks whether a construction-site marker is active today (falls in period1 or period2).
 */
function isConstructionSiteActiveToday(marker: MarkerFeature): boolean {
  if (marker.properties.type !== 'constructionSite') return false;
  const { duration } = marker.properties;
  if (!duration) return false;
  return isTodayInPeriod(duration.period1) || (duration.period2 ? isTodayInPeriod(duration.period2) : false);
}

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
  const [todayOrders, setTodayOrders] = useState(false);
  const [visibleZones, setVisibleZones] = useState<Record<number, boolean>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: markers, isLoading } = useMarkersQuery();
  const { openCreateSupplier, openViewSupplier } = useSupplierDrawerController();

  // Мемоизируем производные данные о маркерах, чтобы не пересоздавать ссылки при каждом рендере
  const allConstructionSiteMarkers = useMemo(
    () =>
      markers?.features?.filter((marker: MarkerFeature) => {
        if (marker.properties.type !== 'constructionSite') return false;
        return todayOrders ? isConstructionSiteActiveToday(marker) : true;
      }) || [],
    [markers, todayOrders]
  );

  const filteredByTypes = useMemo(
    () =>
      selectedTypes && selectedTypes.length > 0
        ? (markers?.features?.filter((marker: MarkerFeature) =>
            selectedTypes.includes(marker.properties.type)
          ) || [])
        : [],
    [markers, selectedTypes]
  );

  const constructionSiteGeoJSON = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: allConstructionSiteMarkers,
    }),
    [allConstructionSiteMarkers]
  );

  const otherMarkersGeoJSON = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: filteredByTypes,
    }),
    [filteredByTypes]
  );

  // Количество активных сегодня стройплощадок (для бейджа в сайдбаре)
  const todaySitesCount = useMemo(
    () => markers?.features?.filter(isConstructionSiteActiveToday).length || 0,
    [markers]
  );

  // Мемоизируем обработчики, чтобы их ссылки были стабильными
  const handleLocationChange = useCallback(
    (newLocation: { center: [number, number]; zoom: number }) => {
      setLocation(newLocation);
    },
    []
  );

  const handleMapClick = useCallback((_coordinates: [number, number]) => {
    setClickMarker(null);
  }, []);

  const handleOpenModal = useCallback((marker: MarkerFeature) => {
    if (marker.properties.type === 'constructionSite') {
      const constructionSiteForm = {
        id: marker.id,
        coordinates: marker.geometry.coordinates,
        type: 'constructionSite' as const,
        orderNumber: marker.properties.orderNumber,
        responsible: marker.properties.responsible,
        paymentMethod: marker.properties.paymentMethod as 'cash' | 'cashless' | 'both' | undefined,
        duration: marker.properties.duration,
        garbageCollectionSupplier: marker.properties.garbageCollectionSupplier,
        phone: '',
        name: '',
        description: '',
      };
      openViewSupplier(constructionSiteForm);
      return;
    }
    const supplierForm = {
      id: marker.id,
      phone: marker.properties.phone || '',
      name: marker.properties.name || '',
      description: marker.properties.description || '',
      coordinates: marker.geometry.coordinates,
      type: marker.properties.type as 'specialTechnique' | 'garbageCollection',
      website: marker.properties.website,
      inn: marker.properties.inn,
      organizationName: marker.properties.organizationName,
      updatedAt: marker.properties.updatedAt,
      email: marker.properties.email,
      reliability: marker.properties.reliability,
      paymentMethod: marker.properties.paymentMethod as 'cash' | 'cashless' | 'both' | undefined,
      zones: marker.properties.zones,
    };
    openViewSupplier(supplierForm);
  }, [openViewSupplier]);

  const handleMarkerClick = useCallback((marker: MarkerFeature) => {
    setLocation({
      center: marker.geometry.coordinates,
      zoom: 14,
    });
    setHoveredId(marker.id);
  }, []);

  const handleFilterChange = useCallback((types: string[] | null) => {
    setSelectedTypes(types);
    setTodayOrders(types?.includes('todayOrders') ?? false);
  }, []);

  const handleZoneToggle = useCallback((zoneNumber: number, visible: boolean) => {
    setVisibleZones((prev) => ({
      ...prev,
      [zoneNumber]: visible,
    }));
  }, []);

  const handleAddMarker = useCallback(() => {
    openCreateSupplier();
  }, [openCreateSupplier]);

  const handleCancelAddMarker = useCallback(() => {
    setClickMarker(null);
  }, []);

  const handleMouseEnter = useCallback((id: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 200);
  }, []);


  return (
    <div className="w-full h-full flex">
      <FilterSidebar
        onAddMarker={openCreateSupplier}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        onFilterChange={handleFilterChange}
        todayOrders={todayOrders}
        todaySitesCount={todaySitesCount}
      />
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <ZoneFilter 
              visibleZones={visibleZones}
              onZoneToggle={handleZoneToggle}
            />
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
              onAddMarker={handleAddMarker}
              onCancelAddMarker={handleCancelAddMarker}
              visibleZones={visibleZones}
            />
          </>
        )}
      </div>
    </div>
  );
}
