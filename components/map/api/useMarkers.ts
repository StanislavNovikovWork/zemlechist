import { useQuery } from "@tanstack/react-query";

export function useMarkers() {
  return useQuery({
    queryKey: ["markers"],
    queryFn: async () => {
      const response = await fetch("/api/markers");
      if (!response.ok) {
        throw new Error("Failed to fetch markers");
      }
      return response.json();
    },
  });
}
