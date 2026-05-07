import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SupplierForm } from "../../model/supplier.types";

/**
 * Преобразует данные формы в формат API
 */
function toApiPayload(values: SupplierForm) {
  console.log('toApiPayload input:', values);
  const [lon, lat] = values.coordinates || [0, 0];
  const payload = {
    lat,
    lon,
    phone: values.phone,
    name: values.name,
    description: values.description,
    type: values.type,
    website: values.website,
    inn: values.inn,
    organizationName: values.organizationName,
    email: values.email,
    reliability: values.reliability,
    orderNumber: values.orderNumber,
    responsible: values.responsible,
    paymentMethod: values.paymentMethod,
    duration: values.duration,
  };
  console.log('toApiPayload output:', payload);
  return payload;
}

/**
 * Хук для создания маркера
 * @returns Объект с мутацией для создания маркера
 */
export function useCreateSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: SupplierForm) => {
      const payload = toApiPayload(values);
      console.log('Sending request with payload:', payload);
      
      const response = await fetch('/api/markers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error('Failed to create marker');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    },
  });
}
