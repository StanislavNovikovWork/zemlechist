import { YMapMarker } from "@/lib/ymaps3";

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
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md" />
        <div className="absolute bottom-[50px] left-1/2 w-[200px] -translate-x-1/2 bg-white px-4 py-3 rounded shadow-lg text-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancelAddMarker();
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
          <div className="text-gray-700 mb-3">Добавить маркер в эту точку?</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMarker();
            }}
            className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
          >
            Добавить точку
          </button>
        </div>
      </div>
    </YMapMarker>
  );
}
