"use client";

import styles from "./StatsCards.module.css";

interface StatsCardsProps {
  matchesPlayed: number;
  totalGoals: number;
  wins: number;
}

export default function StatsCards({
  matchesPlayed,
  totalGoals,
  wins,
}: StatsCardsProps) {
  const winRate =
    matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{matchesPlayed}</span>
        <span className={styles.statLabel}>Matches Played</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{totalGoals}</span>
        <span className={styles.statLabel}>Total Goals</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{winRate}%</span>
        <span className={styles.statLabel}>Win Rate</span>
      </div>
    </div>
  );
}
