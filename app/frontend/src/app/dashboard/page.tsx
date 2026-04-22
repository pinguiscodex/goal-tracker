"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/api/auth-store";
import { useClubStore } from "@/lib/stores/club-store";
import { matchesApi, Match } from "@/lib/api/matches";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentMatchesList from "@/components/dashboard/RecentMatchesList";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { selectedClub, clubStats, loadSubscribedClubs, loadClubStats } =
    useClubStore();
  const [ongoingMatches, setOngoingMatches] = useState<Match[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    checkAuth().then((authenticated) => {
      if (!authenticated) {
        window.location.href = "/auth";
      }
    });
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscribedClubs();
    }
  }, [isAuthenticated, loadSubscribedClubs]);

  const loadMatches = useCallback(async () => {
    try {
      const ongoing = await matchesApi.getOngoing();
      if (mounted.current) {
        setOngoingMatches(ongoing);
      }

      if (selectedClub) {
        const clubMatches = await matchesApi.getByClub(selectedClub.id);
        if (mounted.current) {
          setRecentMatches(clubMatches.filter((m) => m.status === "completed"));
        }
      } else {
        const allMatches = await matchesApi.getAll("completed");
        if (mounted.current) {
          setRecentMatches(allMatches.slice(0, 10));
        }
      }
    } catch (error) {
      console.error("Failed to load matches:", error);
    }
  }, [selectedClub]);

  useEffect(() => {
    mounted.current = true;
    loadMatches();
    const interval = setInterval(() => {
      loadMatches();
    }, 30000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [loadMatches]);

  useEffect(() => {
    if (selectedClub) {
      loadClubStats(selectedClub.id);
    }
  }, [selectedClub, loadClubStats]);

  if (!isAuthenticated) {
    return null;
  }

  const getTotalGoals = () => {
    if (clubStats) {
      return clubStats.goalsScored;
    }
    return recentMatches.reduce(
      (sum, m) => sum + (m.homeGoals || 0) + (m.awayGoals || 0),
      0
    );
  };

  const getWins = () => {
    if (clubStats) {
      return clubStats.wins;
    }
    return 0;
  };

  const getMatchesPlayed = () => {
    if (clubStats) {
      return clubStats.totalMatches;
    }
    return recentMatches.length;
  };

  return (
    <main className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {selectedClub ? selectedClub.name : "Goal Tracker"}
        </h1>
        <Link href="/matches/create" className={styles.newMatchButton}>
          + New Match
        </Link>
      </div>

      {ongoingMatches.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.liveBadge}>LIVE</span>
            Ongoing Matches
          </h2>
          <div className={styles.ongoingMatches}>
            {ongoingMatches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className={styles.ongoingMatchCard}
              >
                <div className={styles.liveIndicator} />
                <div className={styles.matchTeams}>
                  {match.homeTeamClub?.name || match.homeTeamName} vs{" "}
                  {match.awayTeamClub?.name || match.awayTeamName}
                </div>
                <div className={styles.matchScore}>
                  {match.homeGoals} - {match.awayGoals}
                </div>
                <div className={styles.matchMinute}>
                  {match.currentHalf === 1 ? `${match.currentMinute}'` : "HT"}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <StatsCards
          matchesPlayed={getMatchesPlayed()}
          totalGoals={getTotalGoals()}
          wins={getWins()}
        />
      </section>

      <section className={styles.section}>
        <RecentMatchesList matches={recentMatches} />
      </section>
    </main>
  );
}
