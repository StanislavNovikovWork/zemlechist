"use client";

import { memo, useMemo } from 'react';
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

export const Marker = memo(function Marker({
  feature,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onOpenModal,
}: MarkerProps) {
  // Рекурсивная функция для очистки данных от объектов Dayjs
  const cleanDayjsObjects = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj === 'object' && 'format' in obj && typeof (obj as any).format === 'function') {
      // Это объект Dayjs - конвертируем в строку
      return (obj as any).format('DD.MM.YYYY');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(cleanDayjsObjects);
    }
    
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = cleanDayjsObjects(value);
      }
      return cleaned;
    }
    
    return obj;
  };

  // Мемоизируем safeFeature, чтобы не пересоздавать объект и не ререндерить MarkerPopup без причины
  const safeFeature = useMemo(
    () => ({
      ...feature,
      properties: cleanDayjsObjects(feature.properties),
    }),
    [feature, cleanDayjsObjects] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Мемоизируем конфиг — пересчитывается только при изменении фичи или ховера
  const markerConfig = useMemo(
    () => getMarkerConfig(safeFeature.properties.type, isHovered, safeFeature),
    [safeFeature, isHovered]
  );

  const { Icon, offset, color, scale, hasGoldBorder } = markerConfig;

  return (
    <YMapMarker
      key={safeFeature.id}
      coordinates={safeFeature.geometry.coordinates as [number, number]}
      zIndex={safeFeature.properties.type === 'constructionSite' ? 1000 : (isHovered ? 1000 : 0)}
    >
      <div
        onMouseEnter={() => onMouseEnter(safeFeature.id)}
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
 });

