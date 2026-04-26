import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Хук для удаления маркера
 * @returns Объект с мутацией для удаления маркера
 */
export function useDeleteMarkerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/markers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete marker');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    },
  });
}
