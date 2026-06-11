import type { RankedQueueSummary, RankedQueues, PastSeasonRank } from '../../infrastructure/api/PlayerAnalyticsResponse';
import styles from './AccountRankedSummary.module.css';

interface AccountRankedSummaryProps {
  gameName: string;
  tagLine: string;
  region: string;
  profileIconId: number;
  summonerLevel: number;
  rankedQueues: RankedQueues;
  pastSeasonRanks: PastSeasonRank[];
}

const REGION_FLAGS: Record<string, { label: string; icon: string }> = {
  BR1: { label: 'Brazil', icon: '🇧🇷' },
  KR: { label: 'Korea', icon: '🇰🇷' },
  NA1: { label: 'United States', icon: '🇺🇸' },
  EUW1: { label: 'European Union', icon: '🇪🇺' },
  EUNE1: { label: 'European Union', icon: '🇪🇺' },
};

const QUEUE_LABELS: Record<string, string> = {
  soloDuo: 'Solo/Duo',
  flex: 'Flex',
};

const RANKED_TIERS = new Set([
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
]);

const RANK_EMBLEM_BASE_URL =
  'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images';

function formatRank(queue: RankedQueueSummary): string {
  if (!queue.tier || !queue.rank) {
    return 'Unranked';
  }

  return `${toTitleCase(queue.tier)} ${queue.rank}`;
}

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatWinRate(winRate: number | null): string | null {
  if (winRate === null) {
    return null;
  }

  return `${winRate.toFixed(1)}%`;
}

function getRankEmblem(queue: RankedQueueSummary): { src: string; alt: string } | null {
  if (!queue.tier) {
    return null;
  }

  const tier = queue.tier.toUpperCase();
  if (!RANKED_TIERS.has(tier)) {
    return null;
  }

  return {
    src: `${RANK_EMBLEM_BASE_URL}/${tier.toLowerCase()}.png`,
    alt: `${toTitleCase(tier)} rank emblem`,
  };
}

function RankedQueueItem({ label, queue }: { label: string; queue: RankedQueueSummary }) {
  const ranked = queue.tier !== null && queue.rank !== null;
  const winRate = formatWinRate(queue.winRate);
  const emblem = getRankEmblem(queue);

  return (
    <div className={styles.queueItem}>
      <div className={styles.emblemFrame}>
        {emblem ? (
          <img
            className={styles.emblem}
            src={emblem.src}
            alt={emblem.alt}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        ) : (
          <span className={styles.unrankedMark} aria-hidden="true">
            -
          </span>
        )}
      </div>
      <div className={styles.queueDetails}>
        <span className={styles.queueLabel}>{label}</span>
        <strong className={styles.rankText}>{formatRank(queue)}</strong>
        {ranked && (
          <span className={styles.queueStats}>
            {queue.leaguePoints} LP
            <span className={styles.statDivider}>/</span>
            {queue.wins}W {queue.losses}L
            {winRate && (
              <>
                <span className={styles.statDivider}>/</span>
                {winRate}
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export function AccountRankedSummary({
  gameName,
  tagLine,
  region,
  profileIconId,
  summonerLevel,
  rankedQueues,
  pastSeasonRanks,
}: AccountRankedSummaryProps) {
  const normalizedRegion = region.toUpperCase();
  const flag = REGION_FLAGS[normalizedRegion] ?? { label: normalizedRegion, icon: normalizedRegion };

  return (
    <section className={`ds-panel ${styles.summary}`} aria-label="Player profile">
      <div className={styles.profileSection}>
        <div className={styles.identity}>
          <div className={styles.avatarContainer}>
            <img
              className={styles.avatar}
              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileIconId}.jpg`}
              alt={`${gameName}'s summoner icon`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src =
                  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/29.jpg';
              }}
            />
            <span className={styles.levelBadge} data-testid="summoner-level">
              {summonerLevel}
            </span>
          </div>
          <div className={styles.identityText}>
            <div className={styles.riotId}>
              <span className={styles.name}>{gameName}</span>
              <span className={styles.tag}>#{tagLine}</span>
            </div>
            <div className={styles.regionInfo}>
              <span className={styles.flag} role="img" aria-label={flag.label}>
                {flag.icon}
              </span>
              <span className={styles.region}>{normalizedRegion}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.queues}>
        <RankedQueueItem label={QUEUE_LABELS.soloDuo} queue={rankedQueues.soloDuo} />
        <RankedQueueItem label={QUEUE_LABELS.flex} queue={rankedQueues.flex} />
      </div>
      {pastSeasonRanks && pastSeasonRanks.length > 0 && (
        <div className={styles.pastRanks} data-testid="past-ranks">
          {pastSeasonRanks.map((pr) => (
            <span key={pr.season} className={styles.pastRankPill}>
              <strong>{pr.season}</strong> {pr.tier} {pr.rank}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
