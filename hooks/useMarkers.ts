import { useState, useEffect } from "react";

export function useMarkers() {
  const [markers, setMarkers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await fetch('/api/markers');
        const data = await response.json();
        setMarkers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching markers:', error);
        setError('Failed to fetch markers');
        setLoading(false);
      }
    }
    fetchMarkers();
  }, []);

  return { markers, loading, error };
}
