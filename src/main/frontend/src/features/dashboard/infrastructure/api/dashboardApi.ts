import type { PlayerAnalyticsResponse } from './PlayerAnalyticsResponse';

export async function fetchPlayerAnalytics(
  gameName: string,
  tagLine: string,
  region: string
): Promise<PlayerAnalyticsResponse> {
  const name = encodeURIComponent(gameName.trim());
  const tag = encodeURIComponent(tagLine.trim());
  const lowerRegion = encodeURIComponent(region.toLowerCase().trim());
  
  // Fetch maximum matches (100) to support client-side range filtering
  const response = await fetch(`/api/summoner/${name}/${tag}?region=${lowerRegion}&count=100`);
  
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
