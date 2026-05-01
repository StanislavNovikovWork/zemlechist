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
        <svg width="60" height="68" viewBox="0 0 60 68" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(7 5)" fill="#FF4A3D">
            <path d="M23.51 51.523c-.01.267-.23.477-.52.477a.5.5 0 0 1-.5-.477c-.145-3.168-1.756-5.217-4.832-6.147C7.53 42.968 0 33.863 0 23 0 10.297 10.297 0 23 0s23 10.297 23 23c0 10.863-7.53 19.968-17.658 22.376-3.076.93-4.687 2.98-4.83 6.147z"/>
          </g>
          <circle cx="30" cy="64" r="4" fill="#FFFFFF"/>
          <circle cx="30" cy="64" r="2" fill="#FF4A3D"/>
          <g transform="translate(18 16)">
            <path
              fill="#FFFFFF"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18.2V23h11.4a.6.6 0 0 0 .6-.6V8.6a.6.6 0 0 0-.6-.6h-4.954l-.158 2H20v1h-3.79l-.159 2H20v1h-4.028l-.373 4.715a.303.303 0 0 1-.323.284.306.306 0 0 1-.276-.309V2.4a.4.4 0 0 0-.4-.4H14v-.6a.4.4 0 0 0-.4-.4H3.4a.4.4 0 0 0-.4.4V2h-.6a.4.4 0 0 0-.4.4v20a.6.6 0 0 0 .6.6H7v-4.8c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2zM5.5 15V9h2v6h-2zm4-6v6h2V9h-2zm-4-2V4h2v3h-2zm4-3v3h2V4h-2zM17 17v-1h3v1h-3z"
            />
            <path fill="#FFFFFF" d="M16.526 7l.079-1H19.6c.22 0 .4.18.4.4V7h-3.474z"/>
          </g>
        </svg>
        {isHovered && (
          <div className="absolute left-1/2 -translate-x-1/2 mb-2" style={{ bottom: '100%' }}>
            <div className="w-[200px] bg-white px-4 py-3 rounded shadow-lg text-sm">
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
          </div>
        )}
      </div>
    </YMapMarker>
  );
}
