import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Хук для обновления маркера
 * @returns Объект с мутацией для обновления маркера
 */
export function useUpdateMarkerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: number; values: any }) => {
      const response = await fetch(`/api/markers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
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
