import { YMapMarker } from "@/lib/ymaps3";
import { Button } from "antd";

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
  return (
    <YMapMarker coordinates={coordinates} zIndex={3000}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div className="w-[18px] h-[18px] rounded-full bg-blue-500 border-2 border-white shadow-md" />
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
      </div>
    </YMapMarker>
  );
}
