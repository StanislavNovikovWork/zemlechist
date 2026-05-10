"use client";

import { YMapMarker } from "@/lib/ymaps3";
import { MarkerFeature } from "../../types";
import { MarkerPopup } from "../MarkerPopup";
import { getMarkerConfig } from "./model/getMarkerConfig";

/**
 * Пропсы компонента Marker
 * @property feature - Маркер для отображения
 * @property isHovered - Наведен ли курсор на маркер
 * @property onMouseEnter - Callback при наведении курсора на маркер
 * @property onMouseLeave - Callback при уходе курсора с маркера
 * @property onOpenModal - Callback при клике на маркер для открытия модального окна просмотра
 */
interface MarkerProps {
  feature: MarkerFeature;
  isHovered: boolean;
  onMouseEnter: (id: number) => void;
  onMouseLeave: () => void;
  onOpenModal: (marker: MarkerFeature) => void;
}

export function Marker({
  feature,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onOpenModal,
}: MarkerProps) {
  // Проверка на наличие объектов Dayjs в свойствах и их преобразование
  const safeFeature = {
    ...feature,
    properties: {
      ...feature.properties,
      updatedAt: (() => {
        const updatedAt = feature.properties.updatedAt;
        if (typeof updatedAt === 'string') {
          return updatedAt;
        }
        if (updatedAt && typeof updatedAt === 'object' && 'toLocaleDateString' in updatedAt) {
          return (updatedAt as any).toLocaleDateString();
        }
        return null;
      })()
    }
  };

  const { Icon, offset, color, scale, hasGoldBorder } = getMarkerConfig(
    safeFeature.properties.type,
    isHovered,
    safeFeature
  );

  return (
    <YMapMarker
      key={feature.id}
      coordinates={feature.geometry.coordinates as [number, number]}
      zIndex={feature.properties.type === 'constructionSite' ? 1000 : (isHovered ? 1000 : 0)}
    >
      <div
        onMouseEnter={() => onMouseEnter(feature.id)}
        onMouseLeave={onMouseLeave}
        className="relative z-[1]"
        style={{ 
          transform: `translate(-50%, -100%) scale(${scale})`,
          transition: "transform 0.2s ease-in-out"
        }}
      >
        <Icon color={color} hasGoldBorder={hasGoldBorder} />
        
        {/* Звездочка для надежности 5 */}
        {hasGoldBorder && (
          <div
            style={{
              position: "absolute",
              right: "-8px",
              top: "8px",
              width: "16px",
              height: "16px",
              backgroundColor: "#FFD700",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            <span style={{ 
              fontSize: "10px", 
              color: "#fff", 
              fontWeight: "bold",
              lineHeight: 1 
            }}>
              ★
            </span>
          </div>
        )}

        {isHovered && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "100%",
              transform: `translate(-50%, ${offset[1]}px)`,
            }}
          >
            <MarkerPopup
              marker={safeFeature}
              onOpenModal={onOpenModal}
              onMouseLeave={onMouseLeave}
            />
          </div>
        )}
      </div>
    </YMapMarker>
  );
}
