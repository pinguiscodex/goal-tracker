import api from "./client";
import { useAuthStore } from "./auth-store";

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  format: "league" | "knockout" | "group_knockout" | "double_elimination";
  startDate?: string;
  endDate?: string;
  status: "upcoming" | "ongoing" | "completed";
  halfDuration: number;
  createdAt: string;
}

export interface TournamentStanding {
  groupId: string;
  clubId: string;
  club: { id: string; name: string; logo?: string };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  position: number;
}

export const tournamentsApi = {
  getAll: () => api.get<Tournament[]>("tournaments"),

  getById: (id: string) => api.get<Tournament>(`tournaments/${id}`),

  getStandings: (id: string) =>
    api.get<Map<string, TournamentStanding[]>>(`tournaments/${id}/standings`),

  create: (data: Partial<Tournament>) => {
    const token = useAuthStore.getState().token;
    return api.post<Tournament>("tournaments", data, token ?? undefined);
  },

  addGroup: (id: string, name: string, order?: number) => {
    const token = useAuthStore.getState().token;
    return api.post(
      `tournaments/${id}/groups`,
      { name, order },
      token ?? undefined
    );
  },

  addClubToGroup: (groupId: string, clubId: string) => {
    const token = useAuthStore.getState().token;
    return api.post(
      `tournaments/groups/${groupId}/clubs`,
      { clubId },
      token ?? undefined
    );
  },
};
