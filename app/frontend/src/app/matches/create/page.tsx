"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/api/auth-store";
import { useClubStore } from "@/lib/stores/club-store";
import { matchesApi, MatchType } from "@/lib/api/matches";
import { clubsApi, Club } from "@/lib/api/clubs";
import styles from "./create.module.css";

type StartMode = "now" | "scheduled";

export default function CreateMatchPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { loadSubscribedClubs } = useClubStore();
  const [allClubs, setAllClubs] = useState<Club[]>([]);

  const [homeTeamType, setHomeTeamType] = useState<"club" | "custom">("custom");
  const [awayTeamType, setAwayTeamType] = useState<"club" | "custom">("custom");
  const [homeTeamClubId, setHomeTeamClubId] = useState("");
  const [awayTeamClubId, setAwayTeamClubId] = useState("");
  const [homeTeamName, setHomeTeamName] = useState("");
  const [awayTeamName, setAwayTeamName] = useState("");

  const [matchType, setMatchType] = useState<MatchType>("friendly");
  const [venue, setVenue] = useState("");
  const [referee, setReferee] = useState("");
  const [notes, setNotes] = useState("");

  const [startMode, setStartMode] = useState<StartMode>("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [halfDuration, setHalfDuration] = useState(45);
  const [halfTimeDuration, setHalfTimeDuration] = useState(15);
  const [overtimeEnabled, setOvertimeEnabled] = useState(false);
  const [overtimeDuration, setOvertimeDuration] = useState(15);

  const loadAllClubs = useCallback(async () => {
    try {
      const clubs = await clubsApi.getAll();
      setAllClubs(clubs);
    } catch (error) {
      console.error("Failed to load clubs:", error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscribedClubs();
      loadAllClubs();
    }
  }, [isAuthenticated, router, loadSubscribedClubs, loadAllClubs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const homeTeamClub = homeTeamType === "club" ? homeTeamClubId : undefined;
    const awayTeamClub = awayTeamType === "club" ? awayTeamClubId : undefined;

    let scheduledStartTime: string | undefined;
    if (startMode === "scheduled" && scheduledDate && scheduledTime) {
      scheduledStartTime = new Date(
        `${scheduledDate}T${scheduledTime}`
      ).toISOString();
    }

    try {
      const match = await matchesApi.create({
        homeTeamName: homeTeamType === "custom" ? homeTeamName : undefined,
        awayTeamName: awayTeamType === "custom" ? awayTeamName : undefined,
        homeTeamClubId: homeTeamClub || undefined,
        awayTeamClubId: awayTeamClub || undefined,
        matchType,
        venue: venue || undefined,
        referee: referee || undefined,
        notes: notes || undefined,
        scheduledStartTime,
        halfDuration,
        halfTimeDuration,
      });

      if (startMode === "now") {
        const startedMatch = await matchesApi.start(match.id);
        router.push(`/matches/${startedMatch.id}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create match:", error);
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Create New Match</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Teams</h2>

          <div className={styles.teamSection}>
            <h3>Home Team</h3>
            <div className={styles.teamTypeSelector}>
              <label>
                <input
                  type="radio"
                  name="homeTeamType"
                  checked={homeTeamType === "club"}
                  onChange={() => setHomeTeamType("club")}
                />
                Select Club
              </label>
              <label>
                <input
                  type="radio"
                  name="homeTeamType"
                  checked={homeTeamType === "custom"}
                  onChange={() => setHomeTeamType("custom")}
                />
                Custom Team
              </label>
            </div>

            {homeTeamType === "club" ? (
              <select
                value={homeTeamClubId}
                onChange={(e) => setHomeTeamClubId(e.target.value)}
                className={styles.select}
              >
                <option value="">Select a club</option>
                {allClubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Home Team Name"
                value={homeTeamName}
                onChange={(e) => setHomeTeamName(e.target.value)}
                className={styles.input}
                required
              />
            )}
          </div>

          <div className={styles.teamSection}>
            <h3>Away Team</h3>
            <div className={styles.teamTypeSelector}>
              <label>
                <input
                  type="radio"
                  name="awayTeamType"
                  checked={awayTeamType === "club"}
                  onChange={() => setAwayTeamType("club")}
                />
                Select Club
              </label>
              <label>
                <input
                  type="radio"
                  name="awayTeamType"
                  checked={awayTeamType === "custom"}
                  onChange={() => setAwayTeamType("custom")}
                />
                Custom Team
              </label>
            </div>

            {awayTeamType === "club" ? (
              <select
                value={awayTeamClubId}
                onChange={(e) => setAwayTeamClubId(e.target.value)}
                className={styles.select}
              >
                <option value="">Select a club</option>
                {allClubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Away Team Name"
                value={awayTeamName}
                onChange={(e) => setAwayTeamName(e.target.value)}
                className={styles.input}
                required
              />
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Match Details</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Match Type</label>
              <select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value as MatchType)}
                className={styles.select}
              >
                <option value="friendly">Friendly</option>
                <option value="league">League</option>
                <option value="cup">Cup</option>
                <option value="tournament">Tournament</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Venue (optional)</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className={styles.input}
                placeholder="Stadium name"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Referee (optional)</label>
              <input
                type="text"
                value={referee}
                onChange={(e) => setReferee(e.target.value)}
                className={styles.input}
                placeholder="Referee name"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.textarea}
              placeholder="Additional notes..."
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Timing</h2>

          <div className={styles.startModeSelector}>
            <label className={styles.radioCard}>
              <input
                type="radio"
                name="startMode"
                checked={startMode === "now"}
                onChange={() => setStartMode("now")}
              />
              <span className={styles.radioLabel}>Start Now</span>
              <span className={styles.radioDescription}>
                Begin tracking immediately
              </span>
            </label>
            <label className={styles.radioCard}>
              <input
                type="radio"
                name="startMode"
                checked={startMode === "scheduled"}
                onChange={() => setStartMode("scheduled")}
              />
              <span className={styles.radioLabel}>Schedule</span>
              <span className={styles.radioDescription}>
                Set a future start time
              </span>
            </label>
          </div>

          {startMode === "scheduled" && (
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Half Duration (minutes)</label>
              <input
                type="number"
                value={halfDuration}
                onChange={(e) => setHalfDuration(Number(e.target.value))}
                className={styles.input}
                min={15}
                max={90}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Half-time Duration (minutes)</label>
              <input
                type="number"
                value={halfTimeDuration}
                onChange={(e) => setHalfTimeDuration(Number(e.target.value))}
                className={styles.input}
                min={5}
                max={30}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={overtimeEnabled}
                onChange={(e) => setOvertimeEnabled(e.target.checked)}
              />
              Enable Overtime
            </label>
          </div>

          {overtimeEnabled && (
            <div className={styles.formGroup}>
              <label>Overtime Duration (minutes)</label>
              <input
                type="number"
                value={overtimeDuration}
                onChange={(e) => setOvertimeDuration(Number(e.target.value))}
                className={styles.input}
                min={5}
                max={30}
              />
            </div>
          )}
        </section>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {startMode === "now" ? "Start Match" : "Schedule Match"}
          </button>
        </div>
      </form>
    </main>
  );
}
