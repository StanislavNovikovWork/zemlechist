import { MarkerFeature } from "../../types";

/**
 * Пропсы компонента MarkerPopup
 * @property marker - Маркер для отображения
 * @property onOpenModal - Callback при нажатии кнопки "Подробнее"
 * @property onMouseEnter - Callback при наведении курсора на всплывающее окно (опционально)
 * @property onMouseLeave - Callback при уходе курсора со всплывающего окна
 */
interface MarkerPopupProps {
  marker: MarkerFeature;
  onOpenModal: (marker: MarkerFeature) => void;
  onMouseEnter?: () => void;
  onMouseLeave: () => void;
}

export function MarkerPopup({ marker, onOpenModal, onMouseEnter, onMouseLeave }: MarkerPopupProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-[300px] bg-white px-4 py-3 rounded shadow-lg text-sm"
    >
      <div className="space-y-1">
        {marker.properties.orderNumber && (
          <div>
            <span className="font-semibold text-gray-700">Заказ:</span>{' '}
            <span className="text-gray-900">{marker.properties.orderNumber}</span>
          </div>
        )}
        {marker.properties.phone && (
          <div>
            <span className="font-semibold text-gray-700">Телефон:</span>{' '}
            <span className="text-gray-900">{marker.properties.phone}</span>
          </div>
        )}
        {marker.properties.name && (
          <div>
            <span className="font-semibold text-gray-700">Имя:</span>{' '}
            <span className="text-gray-900">{marker.properties.name}</span>
          </div>
        )}
        {marker.properties.description && (
          <div>
            <span className="font-semibold text-gray-700">Описание:</span>{' '}
            <span className="text-gray-900">{marker.properties.description}</span>
          </div>
        )}
      </div>
      <button
        onClick={() => onOpenModal(marker)}
        className="mt-3 w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
      >
        Подробнее
      </button>
    </div>
  );
}
