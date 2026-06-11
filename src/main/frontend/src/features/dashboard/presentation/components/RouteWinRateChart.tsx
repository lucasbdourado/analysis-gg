import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './RouteWinRateChart.module.css';

const iconUrls: Record<string, string> = {
  Top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
  Jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png',
  Mid: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
  Bot: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
  Support: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png',
};

export const RouteWinRateChart: React.FC = () => {
  const { weekdayFilteredMatches, selectedRole, setSelectedRole } = useDashboard();

  const { activeRoles, hasMatches } = useMemo(() => {
    const rolesMap: Record<string, { wins: number; losses: number }> = {
      Top: { wins: 0, losses: 0 },
      Jungle: { wins: 0, losses: 0 },
      Mid: { wins: 0, losses: 0 },
      Bot: { wins: 0, losses: 0 },
      Support: { wins: 0, losses: 0 },
    };

    weekdayFilteredMatches.forEach((match: MatchSummary) => {
      const pos = match.teamPosition;
      if (!pos) return;

      const normalizedPos = pos.toUpperCase();
      let roleName = '';
      if (normalizedPos === 'TOP') roleName = 'Top';
      else if (normalizedPos === 'JUNGLE') roleName = 'Jungle';
      else if (normalizedPos === 'MIDDLE') roleName = 'Mid';
      else if (normalizedPos === 'BOTTOM') roleName = 'Bot';
      else if (normalizedPos === 'UTILITY') roleName = 'Support';
      else return; // Ignore NONE or any other non-standard positions

      if (match.win) {
        rolesMap[roleName].wins += 1;
      } else {
        rolesMap[roleName].losses += 1;
      }
    });

    const orderedRoles = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];
    const mappedRoles = orderedRoles.map(role => {
      const { wins, losses } = rolesMap[role];
      const total = wins + losses;
      const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
      return {
        roleName: role,
        wins,
        losses,
        winRate,
      };
    });

    const totalStandardGames = mappedRoles.reduce((sum, d) => sum + d.wins + d.losses, 0);

    const active = mappedRoles
      .filter(d => (d.wins + d.losses) > 0)
      .map(d => {
        const gamesPlayed = d.wins + d.losses;
        const playRate = totalStandardGames > 0 ? Math.round((gamesPlayed / totalStandardGames) * 100) : 0;
        return {
          ...d,
          playRate,
        };
      })
      .sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));

    return {
      activeRoles: active,
      hasMatches: active.length > 0,
    };
  }, [weekdayFilteredMatches]);

  return (
    <div className={`ds-panel ${styles.chartCard}`}>
      <h3 className={`ds-heading-md ${styles.chartTitle}`}>Route Performance</h3>
      {!hasMatches ? (
        <div className={styles.emptyState}>No match records to display.</div>
      ) : (
        <div className={styles.chartWrapper}>
          <div className={styles.roleList}>
            {activeRoles.map(role => {
              const iconUrl = iconUrls[role.roleName];
              const gamesPlayed = role.wins + role.losses;
              const isActive = selectedRole === role.roleName;
              return (
                <div
                  key={role.roleName}
                  className={`${styles.roleItem} ${isActive ? styles.roleItemActive : ''}`}
                  onClick={() => {
                    if (selectedRole === role.roleName) {
                      setSelectedRole(null);
                    } else {
                      setSelectedRole(role.roleName);
                    }
                  }}
                >
                  <div className={styles.roleLeft}>
                    {iconUrl && (
                      <img
                        src={iconUrl}
                        className={styles.roleIcon}
                        alt={`${role.roleName} position icon`}
                      />
                    )}
                    <div className={styles.roleNameContainer}>
                      <span className={styles.roleName}>{role.roleName}</span>
                      <span className={styles.rolePlayRate}>
                        {gamesPlayed} {gamesPlayed === 1 ? 'Game' : 'Games'} ({role.playRate}%)
                      </span>
                    </div>
                  </div>
                  <div className={styles.roleRight}>
                    <span
                      className={`${styles.winRateLabel} ${
                        role.winRate >= 60 ? styles.highWinRate : ''
                      }`}
                    >
                      {role.winRate}%
                    </span>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.winSegment}
                          style={{ width: `${role.winRate}%` }}
                        />
                        <div
                          className={styles.lossSegment}
                          style={{ width: `${100 - role.winRate}%` }}
                        />
                      </div>
                      <span className={styles.winLossRecord}>
                        {role.wins}W - {role.losses}L
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
