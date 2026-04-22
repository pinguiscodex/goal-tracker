"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/api/auth-store";
import { tournamentsApi, Tournament } from "@/lib/api/tournaments";
import styles from "./tournaments.module.css";

export default function TournamentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTournament, setNewTournament] = useState<{
    name: string;
    description: string;
    format: "league" | "knockout" | "group_knockout" | "double_elimination";
    startDate: string;
    endDate: string;
  }>({
    name: "",
    description: "",
    format: "league",
    startDate: "",
    endDate: "",
  });

  const loadTournaments = useCallback(async () => {
    try {
      const data = await tournamentsApi.getAll();
      setTournaments(data);
    } catch (error) {
      console.error("Failed to load tournaments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    void loadTournaments();
  }, [isAuthenticated, router, loadTournaments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tournamentsApi.create(newTournament);
      await loadTournaments();
      setCreating(false);
      setNewTournament({
        name: "",
        description: "",
        format: "league",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Failed to create tournament:", error);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tournaments</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className={styles.createButton}
        >
          + Create Tournament
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className={styles.createForm}>
          <h3>Create New Tournament</h3>
          <input
            type="text"
            placeholder="Tournament Name"
            value={newTournament.name}
            onChange={(e) =>
              setNewTournament({ ...newTournament, name: e.target.value })
            }
            required
            className={styles.input}
          />
          <textarea
            placeholder="Description (optional)"
            value={newTournament.description}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                description: e.target.value,
              })
            }
            className={styles.textarea}
          />
          <select
            value={newTournament.format}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                format: e.target.value as
                  | "league"
                  | "knockout"
                  | "group_knockout"
                  | "double_elimination",
              })
            }
            className={styles.select}
          >
            <option value="league">League</option>
            <option value="knockout">Knockout</option>
            <option value="group_knockout">Group + Knockout</option>
          </select>
          <div className={styles.formRow}>
            <input
              type="date"
              value={newTournament.startDate}
              onChange={(e) =>
                setNewTournament({
                  ...newTournament,
                  startDate: e.target.value,
                })
              }
              className={styles.input}
            />
            <input
              type="date"
              value={newTournament.endDate}
              onChange={(e) =>
                setNewTournament({
                  ...newTournament,
                  endDate: e.target.value,
                })
              }
              className={styles.input}
            />
          </div>
          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton}>
              Create
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : tournaments.length === 0 ? (
        <p className={styles.emptyState}>
          No tournaments yet. Create one to get started!
        </p>
      ) : (
        <div className={styles.tournamentsGrid}>
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className={styles.tournamentCard}
            >
              <h3 className={styles.tournamentName}>{tournament.name}</h3>
              <div className={styles.tournamentMeta}>
                <span className={styles.format}>
                  {tournament.format.replace("_", " ")}
                </span>
                <span
                  className={`${styles.status} ${styles[tournament.status]}`}
                >
                  {tournament.status}
                </span>
              </div>
              {tournament.startDate && (
                <p className={styles.dates}>
                  {formatDate(tournament.startDate)} -{" "}
                  {formatDate(tournament.endDate)}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
