"use client";

import Link from "next/link";
import styles from "./RecentMatches.module.css";
import { Match } from "@/lib/api/matches";

interface RecentMatchesListProps {
  matches: Match[];
}

export default function RecentMatchesList({ matches }: RecentMatchesListProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.recentMatches}>
      <h3 className={styles.sectionTitle}>Recent Matches</h3>
      {matches.length === 0 ? (
        <p className={styles.emptyState}>
          No matches yet. Start your first match!
        </p>
      ) : (
        <div className={styles.matchList}>
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className={styles.matchItem}
            >
              <div>
                <div className={styles.matchTeams}>
                  {match.homeTeamClub?.name || match.homeTeamName || "Home"} vs{" "}
                  {match.awayTeamClub?.name || match.awayTeamName || "Away"}
                </div>
                <div className={styles.matchDate}>
                  {match.scheduledStartTime
                    ? formatDate(match.scheduledStartTime)
                    : formatDate(match.createdAt)}
                </div>
              </div>
              <div className={styles.matchScore}>
                {match.homeGoals} - {match.awayGoals}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
