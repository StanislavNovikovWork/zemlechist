import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Хук для обновления маркера
 * @returns Объект с мутацией для обновления маркера
 */
export function useUpdateSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: any) => {
      const { id, ...data } = values;
      const response = await fetch(`/api/markers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
