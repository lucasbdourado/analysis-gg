export interface ParticipantSummary {
  puuid: string;
  gameName: string;
  tagLine: string;
  championId: number;
  championName: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  teamPosition: string;
  teamId: number;
  summoner1Id: number;
  summoner2Id: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  primaryStyleId: number;
  subStyleId: number;
  keystoneId: number;
}
