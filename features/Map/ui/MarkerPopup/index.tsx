import { MarkerFeature } from "../../types";
import { StarFilled } from "@ant-design/icons";

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
      className="w-[300px] bg-white px-4 py-3 rounded shadow-lg text-sm relative"
    >
      {marker.properties.reliability && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <StarFilled className="text-xs" style={{ color: '#FADB14' }} />
          <span className="text-gray-700 text-xs font-medium">{marker.properties.reliability}</span>
        </div>
      )}
      <div className="space-y-1">
        {marker.properties.orderNumber && (
          <div>
            <span className="font-semibold text-gray-700">Заказ:</span>{' '}
            <span className="text-gray-900">{marker.properties.orderNumber}</span>
          </div>
        )}
        {marker.properties.responsible && (
          <div>
            <span className="font-semibold text-gray-700">Ответственный:</span>{' '}
            <span className="text-gray-900">{marker.properties.responsible}</span>
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
        {marker.properties.updatedAt && (
          <div>
            <span className="font-semibold text-gray-700">Обновлено:</span>{' '}
            <span className="text-gray-900">{marker.properties.updatedAt}</span>
          </div>
        )}
        {marker.properties.paymentMethod && (
          <div>
            <span className="font-semibold text-gray-700">Оплата:</span>{' '}
            <span className="text-gray-900">
              {marker.properties.paymentMethod === 'cash' ? 'Нал' : 
               marker.properties.paymentMethod === 'cashless' ? 'Без нал' : 
               'Оба варианта'}
            </span>
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
