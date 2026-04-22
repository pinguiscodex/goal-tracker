"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/api/auth-store";
import {
  tournamentsApi,
  Tournament,
  TournamentStanding,
} from "@/lib/api/tournaments";
import { matchesApi, Match } from "@/lib/api/matches";
import styles from "./tournament.module.css";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [standings, setStandings] = useState<Map<string, TournamentStanding[]>>(
    new Map()
  );
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"standings" | "matches">(
    "standings"
  );

  const loadTournament = useCallback(async () => {
    try {
      const tournamentData = await tournamentsApi.getById(tournamentId);
      setTournament(tournamentData);

      const standingsData = await tournamentsApi.getStandings(tournamentId);
      setStandings(standingsData);

      const matchesData = await matchesApi.getByTournament(tournamentId);
      setMatches(matchesData);
    } catch (error) {
      console.error("Failed to load tournament:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    void loadTournament();
  }, [isAuthenticated, router, loadTournament]);

  if (isLoading || !tournament) {
    return (
      <main className={styles.page}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.backButton}
        >
          Back
        </button>
        <h1 className={styles.title}>{tournament.name}</h1>
        <span className={`${styles.status} ${styles[tournament.status]}`}>
          {tournament.status}
        </span>
      </div>

      {tournament.description && (
        <p className={styles.description}>{tournament.description}</p>
      )}

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "standings" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("standings")}
        >
          Standings
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "matches" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
      </div>

      {activeTab === "standings" ? (
        <div className={styles.standingsSection}>
          {standings.size === 0 ? (
            <p className={styles.emptyState}>No standings yet</p>
          ) : (
            Array.from(standings.entries()).map(
              ([groupName, groupStandings]) => (
                <section key={groupName} className={styles.group}>
                  <h2 className={styles.groupTitle}>{groupName}</h2>
                  <table className={styles.standingsTable}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Club</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupStandings.map((standing) => (
                        <tr key={standing.clubId}>
                          <td className={styles.position}>
                            {standing.position}
                          </td>
                          <td className={styles.clubName}>
                            {standing.club.name}
                          </td>
                          <td>{standing.played}</td>
                          <td>{standing.won}</td>
                          <td>{standing.drawn}</td>
                          <td>{standing.lost}</td>
                          <td>{standing.goalsFor}</td>
                          <td>{standing.goalsAgainst}</td>
                          <td>{standing.goalsFor - standing.goalsAgainst}</td>
                          <td className={styles.points}>{standing.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )
            )
          )}
        </div>
      ) : (
        <div className={styles.matchesSection}>
          {matches.length === 0 ? (
            <p className={styles.emptyState}>No matches scheduled</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className={styles.matchCard}>
                <div className={styles.matchTeams}>
                  {match.homeTeamClub?.name || match.homeTeamName} vs{" "}
                  {match.awayTeamClub?.name || match.awayTeamName}
                </div>
                <div className={styles.matchScore}>
                  {match.status === "completed" ||
                  match.status === "live" ||
                  match.status === "halftime"
                    ? `${match.homeGoals} - ${match.awayGoals}`
                    : "vs"}
                </div>
                {match.status === "live" && (
                  <span className={styles.liveBadge}>LIVE</span>
                )}
                <span className={styles.matchDate}>
                  {match.scheduledStartTime
                    ? new Date(match.scheduledStartTime).toLocaleDateString()
                    : "TBD"}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
