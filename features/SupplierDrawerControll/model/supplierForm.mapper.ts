import type { SupplierFormValues, SupplierForm } from "./supplier.types";


export function toSubmitValues(values: SupplierFormValues): SupplierForm {
  const { coordinates, updatedAt, ...rest } = values;

  const result: SupplierForm = {
    ...rest,
    coordinates: [0, 0],
    updatedAt: updatedAt?.format('DD.MM.YYYY'),
  };

  if (coordinates) {
    const [lat, lng] = coordinates.split(',').map(Number);
    result.coordinates = [lng, lat];
  }

  return result;
}
