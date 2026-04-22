"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/api/auth-store";
import { matchesApi, Match, MatchEvent } from "@/lib/api/matches";
import styles from "./match.module.css";

type MatchEventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "injury"
  | "commentary";

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const matchId = params.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(true);

  const [selectedEventType, setSelectedEventType] =
    useState<MatchEventType | null>(null);
  const [eventTeam, setEventTeam] = useState<"home" | "away">("home");
  const [eventMinute, setEventMinute] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const loadMatch = useCallback(async () => {
    try {
      const data = await matchesApi.getById(matchId);
      if (mounted.current) {
        setMatch(data);
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to load match:", error);
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [matchId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    mounted.current = true;
    loadMatch();
    const interval = setInterval(() => {
      loadMatch();
    }, 10000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, matchId, router, loadMatch]);

  const handleGoal = async (team: "home" | "away") => {
    try {
      await matchesApi.updateGoals(matchId, {
        homeGoals:
          team === "home" ? (match?.homeGoals || 0) + 1 : match?.homeGoals,
        awayGoals:
          team === "away" ? (match?.awayGoals || 0) + 1 : match?.awayGoals,
      });
      await matchesApi.addEvent(matchId, {
        type: "goal",
        team,
        minute: match?.currentMinute || 0,
        playerName: playerName || undefined,
      });
      await loadMatch();
      setPlayerName("");
    } catch (error) {
      console.error("Failed to add goal:", error);
    }
  };

  const handleRemoveGoal = async (team: "home" | "away") => {
    try {
      await matchesApi.updateGoals(matchId, {
        homeGoals:
          team === "home"
            ? Math.max(0, (match?.homeGoals || 0) - 1)
            : match?.homeGoals,
        awayGoals:
          team === "away"
            ? Math.max(0, (match?.awayGoals || 0) - 1)
            : match?.awayGoals,
      });
      await loadMatch();
    } catch (error) {
      console.error("Failed to remove goal:", error);
    }
  };

  const handleHalftime = async () => {
    try {
      await matchesApi.setHalftime(matchId);
      await loadMatch();
    } catch (error) {
      console.error("Failed to set halftime:", error);
    }
  };

  const handleResume = async () => {
    try {
      await matchesApi.resume(matchId);
      await loadMatch();
    } catch (error) {
      console.error("Failed to resume match:", error);
    }
  };

  const handleEndMatch = async () => {
    try {
      await matchesApi.end(matchId);
      await loadMatch();
    } catch (error) {
      console.error("Failed to end match:", error);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedEventType) return;
    try {
      await matchesApi.addEvent(matchId, {
        type: selectedEventType,
        team: eventTeam,
        minute: eventMinute,
        playerName: playerName || undefined,
      });
      await loadMatch();
      setSelectedEventType(null);
      setPlayerName("");
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  if (isLoading || !match) {
    return (
      <main className={styles.page}>
        <p>Loading...</p>
      </main>
    );
  }

  const homeTeamName = match.homeTeamClub?.name || match.homeTeamName || "Home";
  const awayTeamName = match.awayTeamClub?.name || match.awayTeamName || "Away";

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
        <div className={styles.matchInfo}>
          {match.venue && <span className={styles.venue}>{match.venue}</span>}
          {match.status === "live" && (
            <span className={styles.liveBadge}>LIVE</span>
          )}
          {match.status === "halftime" && (
            <span className={styles.halftimeBadge}>HALFTIME</span>
          )}
          {match.status === "completed" && (
            <span className={styles.completedBadge}>COMPLETED</span>
          )}
        </div>
      </div>

      <div className={styles.scoreboard}>
        <div className={styles.team}>
          <span className={styles.teamName}>{homeTeamName}</span>
          <span className={styles.teamGoals}>{match.homeGoals}</span>
          {match.status !== "completed" && (
            <div className={styles.goalControls}>
              <button
                type="button"
                onClick={() => handleGoal("home")}
                className={styles.addGoal}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => handleRemoveGoal("home")}
                className={styles.removeGoal}
              >
                -
              </button>
            </div>
          )}
        </div>

        <div className={styles.matchTime}>
          {match.status === "live" && (
            <span className={styles.minute}>
              {match.currentHalf === 1 ? `${match.currentMinute}'` : "2nd Half"}
            </span>
          )}
          <span className={styles.vs}>-</span>
        </div>

        <div className={styles.team}>
          <span className={styles.teamName}>{awayTeamName}</span>
          <span className={styles.teamGoals}>{match.awayGoals}</span>
          {match.status !== "completed" && (
            <div className={styles.goalControls}>
              <button
                type="button"
                onClick={() => handleGoal("away")}
                className={styles.addGoal}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => handleRemoveGoal("away")}
                className={styles.removeGoal}
              >
                -
              </button>
            </div>
          )}
        </div>
      </div>

      {match.status !== "completed" && (
        <div className={styles.matchControls}>
          {match.status === "live" && (
            <button
              type="button"
              onClick={handleHalftime}
              className={styles.controlButton}
            >
              Halftime
            </button>
          )}
          {match.status === "halftime" && (
            <button
              type="button"
              onClick={handleResume}
              className={styles.controlButton}
            >
              Resume 2nd Half
            </button>
          )}
          <button
            type="button"
            onClick={handleEndMatch}
            className={styles.endButton}
          >
            End Match
          </button>
        </div>
      )}

      <section className={styles.section}>
        <h2>Match Events</h2>
        <div className={styles.eventsList}>
          {events.length === 0 ? (
            <p className={styles.emptyEvents}>No events recorded</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className={styles.event}>
                <span className={styles.eventMinute}>{event.minute}&apos;</span>
                <span className={`${styles.eventType} ${styles[event.type]}`}>
                  {event.type.replace("_", " ")}
                </span>
                <span className={styles.eventTeam}>
                  {event.team === "home" ? homeTeamName : awayTeamName}
                </span>
                {event.playerName && (
                  <span className={styles.playerName}>{event.playerName}</span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {match.status !== "completed" && (
        <section className={styles.section}>
          <h2>Add Event</h2>
          <div className={styles.eventForm}>
            <div className={styles.eventFormRow}>
              <select
                value={selectedEventType || ""}
                onChange={(e) =>
                  setSelectedEventType(
                    (e.target.value as MatchEventType) || null
                  )
                }
                className={styles.select}
              >
                <option value="">Select event type</option>
                <option value="goal">Goal</option>
                <option value="yellow_card">Yellow Card</option>
                <option value="red_card">Red Card</option>
                <option value="injury">Injury</option>
                <option value="substitution">Substitution</option>
              </select>

              <select
                value={eventTeam}
                onChange={(e) =>
                  setEventTeam(e.target.value as "home" | "away")
                }
                className={styles.select}
              >
                <option value="home">{homeTeamName}</option>
                <option value="away">{awayTeamName}</option>
              </select>
            </div>

            <div className={styles.eventFormRow}>
              <input
                type="number"
                value={eventMinute}
                onChange={(e) => setEventMinute(Number(e.target.value))}
                className={styles.input}
                placeholder="Minute"
                min={0}
                max={120}
              />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className={styles.input}
                placeholder="Player name"
              />
            </div>

            <button
              type="button"
              onClick={handleAddEvent}
              disabled={!selectedEventType}
              className={styles.addEventButton}
            >
              Add Event
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
