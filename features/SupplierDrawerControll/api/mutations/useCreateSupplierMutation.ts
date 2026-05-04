import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SupplierForm } from "../../model/supplier.types";

/**
 * Преобразует данные формы в формат API
 */
function toApiPayload(values: SupplierForm) {
  const [lon, lat] = values.coordinates || [0, 0];
  return {
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
    orderNumber: values.orderNumber,
    responsible: values.responsible,
    paymentMethod: values.paymentMethod,
  };
}

/**
 * Хук для создания маркера
 * @returns Объект с мутацией для создания маркера
 */
export function useCreateSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: SupplierForm) => {
      const response = await fetch('/api/markers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toApiPayload(values)),
      });
      if (!response.ok) {
        throw new Error('Failed to create marker');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    },
  });
}
