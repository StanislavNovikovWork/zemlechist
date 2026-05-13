import { useQuery } from "@tanstack/react-query";

export function useSuppliersQuery() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/markers");
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      return response.json();
    },
  });
}

export function useGarbageSuppliersQuery() {
  return useQuery({
    queryKey: ["garbage-suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/markers");
      if (!response.ok) {
        throw new Error("Failed to fetch garbage suppliers");
      }
      const data = await response.json();
      
      // Фильтруем поставщиков с типом "garbageCollection", "specialTechnique" и "nonMetallicMaterials"
      const garbageSuppliers = data.features?.filter(
        (marker: any) => ['garbageCollection', 'specialTechnique', 'nonMetallicMaterials'].includes(marker.properties.type)
      ) || [];
      
      return garbageSuppliers;
    },
  });
}
