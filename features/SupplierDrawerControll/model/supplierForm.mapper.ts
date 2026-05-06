import type { SupplierFormValues } from "../ui/SupplierForm/types";
import type { SupplierForm } from "./supplier.types";


export function toSubmitValues(values: SupplierFormValues): SupplierForm {
  const { coordinates, updatedAt, duration, ...rest } = values;

  const result: SupplierForm = {
    ...rest,
    coordinates: [0, 0],
    updatedAt: updatedAt?.format('DD.MM.YYYY'),
  };

  if (coordinates) {
    const [lat, lng] = coordinates.split(',').map(Number);
    result.coordinates = [lng, lat];
  }

  // Обработка поля duration - конвертируем dayjs объекты в строки
  if (duration && Array.isArray(duration)) {
    result.duration = duration.map((date: any) => {
      if (date && typeof date.format === 'function') {
        return date.format('DD.MM.YYYY');
      }
      return date;
    }) as [any, any];
  }

  return result;
}
