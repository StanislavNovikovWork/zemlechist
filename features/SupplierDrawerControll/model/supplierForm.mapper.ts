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

  // Обработка поля duration - конвертируем dayjs объекты в строки для двух периодов
  if (duration && duration.period1) {
    const convertPeriod = (period: any): [string, string] => {
      return period.map((date: any) => {
        if (date && typeof date.format === 'function') {
          return date.format('DD.MM.YYYY');
        }
        return date;
      }) as [string, string];
    };

    (result as any).duration = {
      period1: convertPeriod(duration.period1),
      period2: duration.period2 ? convertPeriod(duration.period2) : undefined
    };
  }

  return result;
}
