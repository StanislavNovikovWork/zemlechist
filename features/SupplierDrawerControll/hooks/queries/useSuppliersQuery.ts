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
      console.log('All markers data:', data);
      
      // Фильтруем поставщиков с типом "garbageCollection"
      const garbageSuppliers = data.features?.filter(
        (marker: any) => marker.properties.type === 'garbageCollection'
      ) || [];
      
      console.log('Filtered garbage suppliers:', garbageSuppliers);
      return garbageSuppliers;
    },
  });
}
