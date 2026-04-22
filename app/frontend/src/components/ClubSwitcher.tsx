"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/api/auth-store";
import { useClubStore } from "@/lib/stores/club-store";
import styles from "./ClubSwitcher.module.css";

export default function ClubSwitcher() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { subscribedClubs, selectedClub, selectClub, loadSubscribedClubs } =
    useClubStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscribedClubs();
    }
  }, [isAuthenticated, loadSubscribedClubs]);

  if (!isAuthenticated) {
    return (
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Goal Tracker
        </Link>
        <Link href="/auth" className={styles.navButton}>
          Login
        </Link>
      </nav>
    );
  }

  return (
    <nav className={styles.nav}>
      <Link href="/dashboard" className={styles.logo}>
        Goal Tracker
      </Link>

      <div className={styles.navLinks}>
        <Link href="/clubs" className={styles.navLink}>
          Clubs
        </Link>
        <Link href="/tournaments" className={styles.navLink}>
          Tournaments
        </Link>
      </div>

      <div className={styles.userSection}>
        <div className={styles.clubSelector}>
          <button
            className={styles.clubButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedClub ? selectedClub.name : "All Clubs"}
            <span className={styles.dropdownArrow}>▼</span>
          </button>

          {isOpen && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropdownItem} ${!selectedClub ? styles.active : ""}`}
                onClick={() => {
                  selectClub(null);
                  setIsOpen(false);
                }}
              >
                All Clubs
              </button>
              {subscribedClubs.map((club) => (
                <button
                  key={club.id}
                  className={`${styles.dropdownItem} ${selectedClub?.id === club.id ? styles.active : ""}`}
                  onClick={() => {
                    selectClub(club);
                    setIsOpen(false);
                  }}
                >
                  {club.name}
                </button>
              ))}
              <Link
                href="/clubs"
                className={styles.dropdownItemNew}
                onClick={() => setIsOpen(false)}
              >
                + Browse Clubs
              </Link>
            </div>
          )}
        </div>

        <div className={styles.userInfo}>
          <span className={styles.username}>{user?.username}</span>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
