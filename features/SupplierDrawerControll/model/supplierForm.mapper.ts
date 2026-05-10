import type { SupplierFormValues } from "../ui/SupplierForm/types";
import type { SupplierForm } from "./supplier.types";


export function toSubmitValues(values: SupplierFormValues): SupplierForm {
  const { coordinates, updatedAt, duration, ...rest } = values;

  const result: SupplierForm = {
    ...rest,
    coordinates: [0, 0],
  };

  // Добавляем updatedAt только если оно существует и является объектом Dayjs
  if (updatedAt && typeof updatedAt === 'object' && typeof updatedAt.format === 'function') {
    result.updatedAt = updatedAt.format('DD.MM.YYYY');
  } else if (typeof updatedAt === 'string') {
    result.updatedAt = updatedAt;
  }

  if (coordinates) {
    const [lat, lng] = coordinates.split(',').map(Number);
    result.coordinates = [lng, lat];
  }

  // Обработка поля duration - конвертируем dayjs объекты в строки
  if (duration) {
    const durationResult: any = {};
    
    if (duration.period1) {
      durationResult.period1 = duration.period1.map((date: any) => {
        if (date && typeof date.format === 'function') {
          return date.format('DD.MM.YYYY');
        }
        return date;
      });
    }
    
    if (duration.period2) {
      durationResult.period2 = duration.period2.map((date: any) => {
        if (date && typeof date.format === 'function') {
          return date.format('DD.MM.YYYY');
        }
        return date;
      });
    }
    
    (result as any).duration = durationResult;
  }

  return result;
}
