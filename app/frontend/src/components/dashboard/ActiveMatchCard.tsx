"use client";

import { useState } from "react";
import styles from "./ActiveMatchCard.module.css";

interface ActiveMatchCardProps {
  onMatchEnd: (
    homeTeam: string,
    awayTeam: string,
    homeGoals: number,
    awayGoals: number
  ) => void;
}

export default function ActiveMatchCard({ onMatchEnd }: ActiveMatchCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  const handleStart = () => {
    if (homeTeam.trim() && awayTeam.trim()) {
      setIsActive(true);
    }
  };

  const handleEnd = () => {
    if (homeGoals > 0 || awayGoals > 0) {
      onMatchEnd(homeTeam, awayTeam, homeGoals, awayGoals);
    }
    setIsActive(false);
    setHomeTeam("");
    setAwayTeam("");
    setHomeGoals(0);
    setAwayGoals(0);
  };

  if (!isActive) {
    return (
      <div className={styles.activeMatch}>
        <h3 className={styles.sectionTitle}>New Match</h3>
        <div className={styles.matchSetup}>
          <div className={styles.teamInputs}>
            <div className={styles.teamInput}>
              <input
                type="text"
                placeholder="Home Team"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
              />
            </div>
            <div className={styles.teamInput}>
              <input
                type="text"
                placeholder="Away Team"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
              />
            </div>
          </div>
          <button
            className={styles.startButton}
            onClick={handleStart}
            disabled={!homeTeam.trim() || !awayTeam.trim()}
          >
            Start Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.activeMatch}>
      <h3 className={styles.sectionTitle}>Live Match</h3>
      <div className={styles.liveMatch}>
        <div className={styles.matchHeader}>
          {homeTeam} vs {awayTeam}
        </div>
        <div className={styles.scoreBoard}>
          <div className={styles.teamScore}>
            <span className={styles.teamName}>{homeTeam}</span>
            <span className={styles.goalCount}>{homeGoals}</span>
            <div className={styles.goalControls}>
              <button
                className={styles.goalButton}
                onClick={() => setHomeGoals((g) => Math.max(0, g - 1))}
              >
                -
              </button>
              <button
                className={styles.goalButton}
                onClick={() => setHomeGoals((g) => g + 1)}
              >
                +
              </button>
            </div>
          </div>
          <span className={styles.vsDivider}>-</span>
          <div className={styles.teamScore}>
            <span className={styles.teamName}>{awayTeam}</span>
            <span className={styles.goalCount}>{awayGoals}</span>
            <div className={styles.goalControls}>
              <button
                className={styles.goalButton}
                onClick={() => setAwayGoals((g) => Math.max(0, g - 1))}
              >
                -
              </button>
              <button
                className={styles.goalButton}
                onClick={() => setAwayGoals((g) => g + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <button className={styles.endMatchButton} onClick={handleEnd}>
          End Match
        </button>
      </div>
    </div>
  );
}
