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
  // Очищаем данные от возможных объектов Dayjs
  const safeMarker = {
    ...marker,
    properties: {
      ...marker.properties,
      updatedAt: (() => {
        const updatedAt = marker.properties.updatedAt;
        if (!updatedAt) return null;
        if (typeof updatedAt === 'string') return updatedAt;
        if (typeof updatedAt === 'object' && 'format' in updatedAt && typeof (updatedAt as any).format === 'function') {
          return (updatedAt as any).format('DD.MM.YYYY');
        }
        if (typeof updatedAt === 'object' && 'toLocaleDateString' in updatedAt) {
          return (updatedAt as any).toLocaleDateString();
        }
        return 'Некорректная дата';
      })()
    }
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-[220px] bg-white px-3 py-2 rounded shadow-lg text-xs relative"
    >
      {safeMarker.properties.reliability && (
        <div className="absolute top-1 right-1 flex items-center gap-1">
          <StarFilled className="text-[10px]" style={{ color: '#FADB14' }} />
          <span className="text-gray-700 text-[10px] font-medium">{safeMarker.properties.reliability}</span>
        </div>
      )}
      <div className="space-y-0.5">
        {safeMarker.properties.orderNumber && (
          <div>
            <span className="font-semibold text-gray-700">
              {safeMarker.properties.type === 'constructionSite' ? 'Заказ:' : 'Заказ:'}
            </span>{' '}
            <span className="text-gray-900">{safeMarker.properties.orderNumber}</span>
          </div>
        )}
        {safeMarker.properties.responsible && (
          <div>
            <span className="font-semibold text-gray-700">Ответственный:</span>{' '}
            <span className="text-gray-900">{safeMarker.properties.responsible}</span>
          </div>
        )}
        {safeMarker.properties.phone && (
          <div>
            <span className="font-semibold text-gray-700">Телефон:</span>{' '}
            <span className="text-gray-900">{safeMarker.properties.phone}</span>
          </div>
        )}
        {safeMarker.properties.name && safeMarker.properties.type !== 'constructionSite' && (
          <div>
            <span className="font-semibold text-gray-700">Имя:</span>{' '}
            <span className="text-gray-900">{safeMarker.properties.name}</span>
          </div>
        )}
        {safeMarker.properties.duration && safeMarker.properties.type === 'constructionSite' && (
          <div>
            <span className="font-semibold text-gray-700">Продолжительность:</span>{' '}
            <span className="text-gray-900">
              {safeMarker.properties.duration.period1 && (
                <>
                  {safeMarker.properties.duration.period1[0]} - {safeMarker.properties.duration.period1[1]}
                  {safeMarker.properties.duration.period2 && (
                    <> и {safeMarker.properties.duration.period2[0]} - {safeMarker.properties.duration.period2[1]}</>
                  )}
                </>
              )}
            </span>
          </div>
        )}
        {safeMarker.properties.description && (
          <div>
            <span className="font-semibold text-gray-700">Описание:</span>{' '}
            <span className="text-gray-900">{safeMarker.properties.description}</span>
          </div>
        )}
        {safeMarker.properties.updatedAt && (
          <div>
            <span className="font-semibold text-gray-700">Обновлено:</span>{' '}
            <span className="text-gray-900">{safeMarker.properties.updatedAt}</span>
          </div>
        )}
      </div>
      <button
        onClick={() => onOpenModal(safeMarker)}
        className="mt-2 w-full px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
      >
        Подробнее
      </button>
    </div>
  );
}
