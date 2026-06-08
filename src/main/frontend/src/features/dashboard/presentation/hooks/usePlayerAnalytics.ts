import { useState, useEffect } from 'react';
import { fetchPlayerAnalytics } from '../../infrastructure/api/dashboardApi';
import type { PlayerAnalyticsResponse } from '../../infrastructure/api/PlayerAnalyticsResponse';

const QUEUE_PARAM_MAP: Record<string, number> = {
  SOLO_DUO: 420,
  FLEX: 440,
  ARAM: 450,
  CUSTOM: 0,
};

const NORMAL_QUEUES = [400, 430, 490];

export function usePlayerAnalytics(
  gameName: string,
  tagLine: string,
  region: string,
  count: number = 20,
  selectedQueues?: string[]
) {
  const [data, setData] = useState<PlayerAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const queues = selectedQueues || [];
  const queuesKey = queues.join(',');

  useEffect(() => {
    if (!gameName || !tagLine || !region) {
      setError('Riot ID and region are required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let isMounted = true;

    if (queues.length === 0) {
      fetchPlayerAnalytics(gameName, tagLine, region, count)
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
    } else {
      const fetchPromises = queues.map(async (key) => {
        const qParam = QUEUE_PARAM_MAP[key]; // undefined for NORMAL
        const res = await fetchPlayerAnalytics(gameName, tagLine, region, count, qParam);
        return { key, res };
      });

      Promise.all(fetchPromises)
        .then((results) => {
          if (!isMounted) return;

          const firstResponse = results[0].res;
          const mergedMatches: any[] = [];

          results.forEach(({ key, res }) => {
            if (key === 'NORMAL') {
              const filtered = res.matches.filter((m) => NORMAL_QUEUES.includes(m.queueId));
              mergedMatches.push(...filtered);
            } else {
              mergedMatches.push(...res.matches);
            }
          });

          // Deduplicate by matchId, keeping first occurrence
          const uniqueMatches: any[] = [];
          const seenIds = new Set<string>();
          for (const match of mergedMatches) {
            if (!seenIds.has(match.matchId)) {
              seenIds.add(match.matchId);
              uniqueMatches.push(match);
            }
          }

          // Sort chronologically (newest first)
          uniqueMatches.sort((a, b) => b.gameCreation - a.gameCreation);

          // Slice to count
          const slicedMatches = uniqueMatches.slice(0, count);

          setData({
            ...firstResponse,
            matches: slicedMatches,
          });
          setLoading(false);
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message || 'Failed to fetch player data');
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [gameName, tagLine, region, count, queuesKey]);

  return { data, loading, error };
}
