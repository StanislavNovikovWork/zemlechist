import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SupplierForm } from "../../model/supplier.types";

type UpdatePayload = { id: number } & SupplierForm;

/**
 * Преобразует данные формы в формат API для обновления
 */
function toApiPayload(values: SupplierForm) {
  const [lon, lat] = values.coordinates || [0, 0];
  return {
    coordinates: values.coordinates,
    lat,
    lon,
    phone: values.phone,
    name: values.name,
    description: values.description,
    iconCaption: values.iconCaption,
    markerColor: values["marker-color"],
    type: values.type,
    website: values.website,
    inn: values.inn,
    organizationName: values.organizationName,
    email: values.email,
    reliability: values.reliability,
    updatedAt: values.updatedAt,
    orderNumber: values.orderNumber,
    responsible: values.responsible,
    paymentMethod: values.paymentMethod,
  };
}

/**
 * Хук для обновления маркера
 * @returns Объект с мутацией для обновления маркера
 */
export function useUpdateSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdatePayload) => {
      const { id, ...data } = values;
      const response = await fetch(`/api/markers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toApiPayload(data)),
      });
      if (!response.ok) {
        throw new Error('Failed to update marker');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    },
  });
}
