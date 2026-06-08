import type { PlayerAnalyticsResponse } from './PlayerAnalyticsResponse';

export async function fetchPlayerAnalytics(
  gameName: string,
  tagLine: string,
  region: string,
  count: number = 20,
  queue?: number
): Promise<PlayerAnalyticsResponse> {
  const name = encodeURIComponent(gameName.trim());
  const tag = encodeURIComponent(tagLine.trim());
  const lowerRegion = encodeURIComponent(region.toLowerCase().trim());
  
  let url = `/api/summoner/${name}/${tag}?region=${lowerRegion}&count=${count}`;
  if (queue !== undefined) {
    url += `&queue=${queue}`;
  }
  
  // Fetch with specific count (e.g. 20, 50, 100) to optimize Riot API call volume
  const response = await fetch(url);
  
  if (!response.ok) {
    let errorMessage = 'Failed to fetch player data';
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (_) {}
    throw new Error(errorMessage);
  }
  
  return response.json();
}
