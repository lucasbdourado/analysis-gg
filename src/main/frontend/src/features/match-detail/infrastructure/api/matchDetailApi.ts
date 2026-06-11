import type { MatchDetail } from '../../domain/MatchDetail';

export async function fetchMatchDetail(
  matchId: string,
  region: string,
  name: string,
  tag: string
): Promise<MatchDetail> {
  const encodedRegion = encodeURIComponent(region.toLowerCase().trim());
  const encodedName = encodeURIComponent(name.trim());
  const encodedTag = encodeURIComponent(tag.trim());

  const url = `/api/match/${encodeURIComponent(matchId)}?region=${encodedRegion}&name=${encodedName}&tag=${encodedTag}`;
  const response = await fetch(url);

  if (!response.ok) {
    let errorMessage = 'Failed to fetch match details';
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
