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
  const { Icon, offset, color } = getMarkerConfig(
    feature.properties.type,
    isHovered
  );

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
        style={{ transform: "translate(-50%, -100%)" }}
      >
        <Icon color={color} />

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
              marker={feature}
              onOpenModal={onOpenModal}
              onMouseLeave={onMouseLeave}
            />
          </div>
        )}
      </div>
    </YMapMarker>
  );
}
