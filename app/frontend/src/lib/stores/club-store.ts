import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clubsApi, Club, ClubStats } from "../api/clubs";

interface ClubState {
  subscribedClubs: Club[];
  selectedClub: Club | null;
  clubStats: ClubStats | null;
  isLoading: boolean;
  loadSubscribedClubs: () => Promise<void>;
  selectClub: (club: Club | null) => Promise<void>;
  subscribeToClub: (clubId: string) => Promise<void>;
  unsubscribeFromClub: (clubId: string) => Promise<void>;
  loadClubStats: (clubId: string) => Promise<void>;
}

export const useClubStore = create<ClubState>()(
  persist(
    (set, get) => ({
      subscribedClubs: [],
      selectedClub: null,
      clubStats: null,
      isLoading: false,

      loadSubscribedClubs: async () => {
        set({ isLoading: true });
        try {
          const clubs = await clubsApi.getSubscribed();
          set({ subscribedClubs: clubs });
        } catch (error) {
          console.error("Failed to load subscribed clubs:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      selectClub: async (club: Club | null) => {
        set({ selectedClub: club, clubStats: null });
        if (club) {
          await get().loadClubStats(club.id);
        }
      },

      subscribeToClub: async (clubId: string) => {
        await clubsApi.subscribe(clubId);
        await get().loadSubscribedClubs();
      },

      unsubscribeFromClub: async (clubId: string) => {
        await clubsApi.unsubscribe(clubId);
        const { selectedClub } = get();
        if (selectedClub?.id === clubId) {
          set({ selectedClub: null, clubStats: null });
        }
        await get().loadSubscribedClubs();
      },

      loadClubStats: async (clubId: string) => {
        try {
          const stats = await clubsApi.getStats(clubId);
          set({ clubStats: stats });
        } catch (error) {
          console.error("Failed to load club stats:", error);
        }
      },
    }),
    {
      name: "goal-tracker-clubs",
      partialize: (state) => ({
        subscribedClubs: state.subscribedClubs,
        selectedClub: state.selectedClub,
      }),
    }
  )
);
