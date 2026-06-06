import { useState, useEffect } from 'react';
import { fetchPlayerAnalytics } from '../../infrastructure/api/dashboardApi';
import type { PlayerAnalyticsResponse } from '../../infrastructure/api/PlayerAnalyticsResponse';

export function usePlayerAnalytics(gameName: string, tagLine: string, region: string) {
  const [data, setData] = useState<PlayerAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameName || !tagLine || !region) {
      setError('Riot ID and region are required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let isMounted = true;

    fetchPlayerAnalytics(gameName, tagLine, region)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch player data');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [gameName, tagLine, region]);

  return { data, loading, error };
}
