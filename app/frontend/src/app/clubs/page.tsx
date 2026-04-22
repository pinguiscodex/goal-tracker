"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/api/auth-store";
import { clubsApi, Club } from "@/lib/api/clubs";
import { useClubStore } from "@/lib/stores/club-store";
import styles from "./clubs.module.css";

export default function ClubsPage() {
  const { isAuthenticated } = useAuthStore();
  const {
    subscribedClubs,
    loadSubscribedClubs,
    subscribeToClub,
    unsubscribeFromClub,
    selectClub,
    selectedClub,
  } = useClubStore();
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newClubName, setNewClubName] = useState("");
  const [newClubDescription, setNewClubDescription] = useState("");

  const loadAllClubs = useCallback(async () => {
    try {
      const clubs = await clubsApi.getAll();
      setAllClubs(clubs);
    } catch (error) {
      console.error("Failed to load clubs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/auth";
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscribedClubs();
      loadAllClubs();
    }
  }, [isAuthenticated, loadSubscribedClubs, loadAllClubs]);

  const handleSubscribe = async (clubId: string) => {
    await subscribeToClub(clubId);
    await loadAllClubs();
  };

  const handleUnsubscribe = async (clubId: string) => {
    await unsubscribeFromClub(clubId);
    await loadAllClubs();
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newClub = await clubsApi.create({
        name: newClubName,
        description: newClubDescription,
      });
      await subscribeToClub(newClub.id);
      selectClub(newClub);
      setCreating(false);
      setNewClubName("");
      setNewClubDescription("");
    } catch (error) {
      console.error("Failed to create club:", error);
    }
  };

  const filteredClubs = allClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSubscribed = (clubId: string) =>
    subscribedClubs.some((c) => c.id === clubId);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clubs</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className={styles.createButton}
        >
          + Create Club
        </button>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {creating && (
        <form onSubmit={handleCreateClub} className={styles.createForm}>
          <h3>Create New Club</h3>
          <input
            type="text"
            placeholder="Club Name"
            value={newClubName}
            onChange={(e) => setNewClubName(e.target.value)}
            required
            className={styles.formInput}
          />
          <textarea
            placeholder="Description (optional)"
            value={newClubDescription}
            onChange={(e) => setNewClubDescription(e.target.value)}
            className={styles.formTextarea}
          />
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

      {subscribedClubs.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Clubs</h2>
          <div className={styles.clubsGrid}>
            {subscribedClubs.map((club) => (
              <div
                key={club.id}
                className={`${styles.clubCard} ${selectedClub?.id === club.id ? styles.selected : ""}`}
              >
                <h3 className={styles.clubName}>{club.name}</h3>
                {club.description && (
                  <p className={styles.clubDescription}>{club.description}</p>
                )}
                <div className={styles.clubActions}>
                  <button
                    type="button"
                    onClick={() => selectClub(club)}
                    className={styles.viewButton}
                  >
                    View Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnsubscribe(club.id)}
                    className={styles.unsubscribeButton}
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All Clubs</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredClubs.length === 0 ? (
          <p className={styles.emptyState}>No clubs found</p>
        ) : (
          <div className={styles.clubsGrid}>
            {filteredClubs.map((club) => (
              <div key={club.id} className={styles.clubCard}>
                <h3 className={styles.clubName}>{club.name}</h3>
                {club.description && (
                  <p className={styles.clubDescription}>{club.description}</p>
                )}
                {club.location && (
                  <p className={styles.clubLocation}>{club.location}</p>
                )}
                <div className={styles.clubActions}>
                  {isSubscribed(club.id) ? (
                    <>
                      <button
                        type="button"
                        onClick={() => selectClub(club)}
                        className={styles.viewButton}
                      >
                        View Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnsubscribe(club.id)}
                        className={styles.unsubscribeButton}
                      >
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubscribe(club.id)}
                      className={styles.subscribeButton}
                    >
                      Join Club
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
