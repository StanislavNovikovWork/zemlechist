"use client";

import { useState, useRef } from "react";
import { Drawer, Spin, Button, Space } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
} from "@/lib/ymaps3";
import { DEFAULT_LOCATION } from "@/constants/map.constants";
import MapSearch from "../MapSearch";
import { Marker } from "../Marker";
import { MarkerFeature } from "../types";
import { useMarkers } from "../api/useMarkers";
import { useMarkerEdit } from "../api/useMarkerEdit";
import { MarkerDrawerContent } from "../MarkerDrawerContent";

/**
 * Пропсы компонента Map
 * @property location - Начальное расположение карты с координатами центра и уровнем масштаба
 */
interface MapProps {
  location?: { center: [number, number]; zoom: number };
}

export function Map({ location: propLocation = DEFAULT_LOCATION }: MapProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [location, setLocation] = useState(propLocation);
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: markers, isLoading } = useMarkers();
  const {
    isEditing,
    startEditing,
    toggleEdit,
    saveChanges,
    resetEditing,
  } = useMarkerEdit();

  const handleLocationChange = (newLocation: { center: [number, number]; zoom: number }) => {
    setLocation(newLocation);
  };

  const handleSearchResult = (coordinates: [number, number] | null) => {
    setSearchMarker(coordinates);
  };

  const handleOpenModal = (marker: MarkerFeature) => {
    setSelectedMarker(marker);
    startEditing(marker.properties);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMarker(null);
    resetEditing();
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
    <div className="w-full h-full relative">
      <MapSearch onLocationChange={handleLocationChange} onSearchResult={handleSearchResult} />
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <YMap location={location}>
          <YMapDefaultSchemeLayer />
          <YMapDefaultFeaturesLayer />
          {searchMarker && (
            <YMapMarker coordinates={searchMarker} zIndex={2000}>
              <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md" />
            </YMapMarker>
          )}
          {markers?.features?.slice(0, 50).map((feature: MarkerFeature) => (
            <Marker
              key={feature.id}
              feature={feature}
              isHovered={hoveredId === feature.id}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onOpenModal={handleOpenModal}
            />
          ))}
        </YMap>
      )}
      <Drawer
        title={
          <Space>
            Информация о маркере
            <Button
              type="text"
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={isEditing ? saveChanges : toggleEdit}
            />
          </Space>
        }
        placement="right"
        open={isModalOpen}
        onClose={handleCloseModal}
        size="default"
      >
        {selectedMarker && (
          <MarkerDrawerContent
            properties={selectedMarker.properties}
            isEditing={isEditing}
            onSave={(values) => {
              console.log("Saving changes:", values);
              saveChanges();
            }}
            onCancel={toggleEdit}
          />
        )}
      </Drawer>
    </div>
  );
}
