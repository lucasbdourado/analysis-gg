import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchMatchDetail } from '../../infrastructure/api/matchDetailApi';
import type { MatchDetail } from '../../domain/MatchDetail';
import type { ParticipantSummary } from '../../domain/ParticipantSummary';
import runesData from '../../../../assets/data/runes.json';
import spellsData from '../../../../assets/data/spells.json';
import styles from './MatchDetailPage.module.css';

const CHAMPION_ASSET_VERSION = '16.11.1';
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${CHAMPION_ASSET_VERSION}`;
const DDRAGON_IMG = 'https://ddragon.leagueoflegends.com/cdn/img';

// ── Rune/Spell Lookups ──────────────────────────────────────────────

type RuneEntry = { name: string; icon: string };
const runeStyles = runesData.styles as Record<string, RuneEntry>;
const runeKeystones = runesData.keystones as Record<string, RuneEntry>;
const spellMap = spellsData as Record<string, string>;

function getSpellIconUrl(spellId: number): string {
  const name = spellMap[String(spellId)];
  return name
    ? `${DDRAGON_BASE}/img/spell/${name}.png`
    : `${DDRAGON_BASE}/img/spell/SummonerFlash.png`;
}

function getKeystoneIconUrl(keystoneId: number): string {
  const entry = runeKeystones[String(keystoneId)];
  return entry
    ? `${DDRAGON_IMG}/${entry.icon}`
    : `${DDRAGON_IMG}/perk-images/Styles/7201_Precision.png`;
}

function getRuneStyleIconUrl(styleId: number): string {
  const entry = runeStyles[String(styleId)];
  return entry
    ? `${DDRAGON_IMG}/${entry.icon}`
    : `${DDRAGON_IMG}/perk-images/Styles/7201_Precision.png`;
}

// ── Helpers ──────────────────────────────────────────────────────────

function getQueueLabel(queueId: number): string {
  switch (queueId) {
    case 420: return 'Ranked Solo/Duo';
    case 440: return 'Ranked Flex';
    case 450: return 'ARAM';
    case 400: case 430: case 490: return 'Normal';
    case 0: return 'Custom';
    default: return `Queue ${queueId}`;
  }
}

function formatMatchDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function isRemake(duration: number): boolean {
  return duration < 600;
}

function calcCsPerMin(totalCs: number, durationSeconds: number): string {
  if (durationSeconds <= 0) return '0.0';
  return (totalCs / (durationSeconds / 60)).toFixed(1);
}

// ── Item Rendering ───────────────────────────────────────────────────

function ItemSlot({ itemId, isTrinket }: { itemId: number; isTrinket?: boolean }) {
  if (itemId === 0) {
    return <div className={`${styles.emptyItem} ${isTrinket ? styles.trinketItem : ''}`} />;
  }
  return (
    <img
      className={`${styles.itemIcon} ${isTrinket ? styles.trinketItem : ''}`}
      src={`${DDRAGON_BASE}/img/item/${itemId}.png`}
      alt={`Item ${itemId}`}
      loading="lazy"
    />
  );
}

// ── Participant Row ──────────────────────────────────────────────────

type ParticipantRowProps = {
  participant: ParticipantSummary;
  isSearchedPlayer: boolean;
  gameDuration: number;
};

function ParticipantRow({ participant, isSearchedPlayer, gameDuration }: ParticipantRowProps) {
  const p = participant;
  const totalCs = (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0);
  const items = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5];

  return (
    <div
      className={`${styles.participantRow} ${isSearchedPlayer ? styles.highlightedRow : ''}`}
      data-testid="participant-row"
    >
      {/* Player Identity */}
      <div className={styles.playerIdentity}>
        <div className={styles.championFrame}>
          <img
            className={styles.championIcon}
            src={`${DDRAGON_BASE}/img/champion/${p.championName}.png`}
            alt={p.championName}
            loading="lazy"
          />
        </div>

        {/* Spells + Runes */}
        <div className={styles.spellsRunesGroup}>
          <div className={styles.spellRuneColumn}>
            <img
              className={styles.spellIcon}
              src={getSpellIconUrl(p.summoner1Id)}
              alt="Spell 1"
              loading="lazy"
            />
            <img
              className={styles.spellIcon}
              src={getSpellIconUrl(p.summoner2Id)}
              alt="Spell 2"
              loading="lazy"
            />
          </div>
          <div className={styles.spellRuneColumn}>
            <img
              className={styles.runeIcon}
              src={getKeystoneIconUrl(p.keystoneId)}
              alt="Keystone"
              loading="lazy"
            />
            <img
              className={`${styles.runeIcon} ${styles.runeIconSub}`}
              src={getRuneStyleIconUrl(p.subStyleId)}
              alt="Sub style"
              loading="lazy"
            />
          </div>
        </div>

        {/* Player Name */}
        <div className={styles.playerInfo}>
          <span
            className={`${styles.playerName} ${isSearchedPlayer ? styles.playerNameBold : ''}`}
            title={`${p.gameName}#${p.tagLine}`}
          >
            {p.gameName}
          </span>
        </div>
      </div>

      {/* KDA */}
      <div className={styles.kdaCell}>
        <div className={styles.kdaValue}>{p.kills}/{p.deaths}/{p.assists}</div>
      </div>

      {/* CS */}
      <div className={styles.csCell}>
        <div>{totalCs}</div>
        <div className={styles.csMin}>{calcCsPerMin(totalCs, gameDuration)}/m</div>
      </div>

      {/* Items */}
      <div className={styles.itemsCell}>
        {items.map((id, i) => (
          <ItemSlot key={i} itemId={id} />
        ))}
        <ItemSlot itemId={p.item6} isTrinket />
      </div>
    </div>
  );
}

// ── Team Panel ───────────────────────────────────────────────────────

type TeamPanelProps = {
  teamLabel: string;
  teamSide: 'blue' | 'red';
  participants: ParticipantSummary[];
  searchedPuuid: string | null;
  gameDuration: number;
  didWin: boolean;
};

function TeamPanel({ teamLabel, teamSide, participants, searchedPuuid, gameDuration, didWin }: TeamPanelProps) {
  const headerClass = teamSide === 'blue' ? styles.blueTeamHeader : styles.redTeamHeader;
  const outcomeClass = didWin ? styles.teamWin : styles.teamLoss;

  return (
    <div className={styles.teamPanel}>
      <div className={`${styles.teamHeader} ${headerClass}`}>
        <span>{teamLabel}</span>
        <span className={`${styles.teamOutcome} ${outcomeClass}`}>
          {didWin ? 'Victory' : 'Defeat'}
        </span>
      </div>
      <div className={styles.columnHeaders}>
        <span>Player</span>
        <span className={`${styles.colRight} ${styles.colKda}`}>KDA</span>
        <span className={`${styles.colRight} ${styles.colCs}`}>CS</span>
        <span className={styles.colRight}>Items</span>
      </div>
      <div className={styles.teamRoster}>
        {participants.map((p) => (
          <ParticipantRow
            key={p.puuid}
            participant={p}
            isSearchedPlayer={p.puuid === searchedPuuid}
            gameDuration={gameDuration}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const region = searchParams.get('region') || 'br1';
  const name = searchParams.get('name') || '';
  const tag = searchParams.get('tag') || '';

  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMatchDetail(matchId, region, name, tag)
      .then((data) => {
        if (!cancelled) setMatch(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [matchId, region, name, tag]);

  const handleBack = () => {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (tag) params.set('tag', tag);
    if (region) params.set('region', region);
    navigate(`/dashboard?${params.toString()}`);
  };

  // Derive teams
  const { blueTeam, redTeam, searchedPuuid } = useMemo(() => {
    if (!match?.participants) return { blueTeam: [], redTeam: [], searchedPuuid: null };

    const blue = match.participants.filter((p) => p.teamId === 100);
    const red = match.participants.filter((p) => p.teamId === 200);

    // Find the searched player – match by gameName+tagLine from the URL
    const searched = match.participants.find(
      (p) => p.gameName.toLowerCase() === name.toLowerCase() &&
             p.tagLine.toLowerCase() === tag.toLowerCase()
    );

    return {
      blueTeam: blue,
      redTeam: red,
      searchedPuuid: searched?.puuid ?? null,
    };
  }, [match, name, tag]);

  // ── Loading State ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={handleBack} type="button">
            <span className={styles.backArrow}>←</span> Dashboard
          </button>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading match details…</span>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────
  if (error || !match) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={handleBack} type="button">
            <span className={styles.backArrow}>←</span> Dashboard
          </button>
        </div>
        <div className={styles.errorState}>
          <span className={styles.errorText}>{error || 'Match not found'}</span>
          <button
            className={`ds-button ds-button-ghost ${styles.retryButton}`}
            onClick={() => window.location.reload()}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Rendered Match Detail ──────────────────────────────────────────
  const remake = isRemake(match.gameDuration);
  const outcomeLabel = remake ? 'Remake' : match.win ? 'Victory' : 'Defeat';
  const outcomeClass = remake
    ? styles.outcomeRemake
    : match.win
      ? styles.outcomeWin
      : styles.outcomeLoss;

  const blueDidWin = blueTeam.length > 0 ? blueTeam[0].win : false;
  const redDidWin = redTeam.length > 0 ? redTeam[0].win : false;

  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={handleBack} type="button" id="back-to-dashboard">
          <span className={styles.backArrow}>←</span> Dashboard
        </button>
      </div>

      {/* Match Header Banner */}
      <div className={styles.matchHeader}>
        <span className={`${styles.outcomeTag} ${outcomeClass}`}>{outcomeLabel}</span>
        <div className={styles.headerMeta}>
          <span>{getQueueLabel(match.queueId)}</span>
          <span>{formatMatchDate(match.gameCreation)}</span>
          <span>{formatDuration(match.gameDuration)}</span>
        </div>
      </div>

      {/* Teams */}
      <div className={styles.teamsContainer}>
        <TeamPanel
          teamLabel="Blue Team"
          teamSide="blue"
          participants={blueTeam}
          searchedPuuid={searchedPuuid}
          gameDuration={match.gameDuration}
          didWin={blueDidWin}
        />
        <TeamPanel
          teamLabel="Red Team"
          teamSide="red"
          participants={redTeam}
          searchedPuuid={searchedPuuid}
          gameDuration={match.gameDuration}
          didWin={redDidWin}
        />
      </div>
    </div>
  );
}
