import { YMapMarker } from "@/lib/ymaps3";
import { Button } from "antd";
import { useState } from "react";

/**
 * Пропсы компонента ClickMarker
 * @property coordinates - Координаты маркера
 * @property onAddMarker - Callback при клике на кнопку "Добавить точку"
 * @property onCancelAddMarker - Callback при клике на крестик для отмены
 */
interface ClickMarkerProps {
  coordinates: [number, number];
  onAddMarker: () => void;
  onCancelAddMarker: () => void;
}

export function ClickMarker({ coordinates, onAddMarker, onCancelAddMarker }: ClickMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <YMapMarker coordinates={coordinates} zIndex={3000}>
      <div
        className="relative"
        style={{ transform: 'translate(-50%, -100%)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e: any) => e.stopPropagation()}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 2C11.7157 2 5 8.71573 5 17C5 28.25 20 38 20 38C20 38 35 28.25 35 17C35 8.71573 28.2843 2 20 2Z"
            fill="#FF4444"
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="20" cy="17" r="6" fill="white" />
        </svg>
        {isHovered && (
          <div className="absolute bottom-[25px] left-1/2 w-[200px] -translate-x-1/2 bg-white px-4 py-3 rounded shadow-lg text-sm">
            <Button
              type="primary"
              block
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onAddMarker();
              }}
            >
              Добавить точку
            </Button>
          </div>
        )}
      </div>
    </YMapMarker>
  );
}
