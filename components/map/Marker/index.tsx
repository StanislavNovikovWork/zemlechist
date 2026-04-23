"use client";

import { YMapMarker } from "@/lib/ymaps3";
import { MarkerFeature } from "../types";
import { MarkerPopup } from "../MarkerPopup";

/**
 * Пропсы компонента Marker
 * @property feature - Маркер для отображения
 * @property isHovered - Наведен ли курсор на маркер
 * @property onMouseEnter - Callback при наведении курсора на маркер
 * @property onMouseLeave - Callback при уходе курсора с маркера
 * @property onOpenModal - Callback при клике на маркер для открытия модального окна
 */
interface MarkerProps {
  feature: MarkerFeature;
  isHovered: boolean;
  onMouseEnter: (id: number) => void;
  onMouseLeave: () => void;
  onOpenModal: (marker: MarkerFeature) => void;
}

export function Marker({ feature, isHovered, onMouseEnter, onMouseLeave, onOpenModal }: MarkerProps) {
  return (
    <YMapMarker
      key={feature.id}
      coordinates={feature.geometry.coordinates as [number, number]}
      zIndex={isHovered ? 1000 : 0}
    >
      <div
        onMouseEnter={() => onMouseEnter(feature.id)}
        onMouseLeave={onMouseLeave}
        className="relative z-[1]"
      >
        <div className="w-6 h-6 rounded-full bg-[#ffd21e] border-2 border-white shadow-md" />
        {isHovered && (
          <MarkerPopup
            marker={feature}
            onOpenModal={onOpenModal}
            onMouseEnter={() => onMouseEnter(feature.id)}
            onMouseLeave={onMouseLeave}
          />
        )}
      </div>
    </YMapMarker>
  );
}
