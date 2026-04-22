import api from "./client";
import { useAuthStore } from "./auth-store";

export interface Club {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  location?: string;
  createdAt: string;
}

export interface ClubStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
}

export const clubsApi = {
  getAll: () => api.get<Club[]>("clubs"),

  getById: (id: string) => api.get<Club>(`clubs/${id}`),

  getSubscribed: () => {
    const token = useAuthStore.getState().token;
    return api.get<Club[]>("clubs/subscribed", token ?? undefined);
  },

  getStats: (id: string) => api.get<ClubStats>(`clubs/${id}/stats`),

  create: (data: Partial<Club>) => {
    const token = useAuthStore.getState().token;
    return api.post<Club>("clubs", data, token ?? undefined);
  },

  subscribe: (id: string) => {
    const token = useAuthStore.getState().token;
    return api.post(`clubs/${id}/subscribe`, undefined, token ?? undefined);
  },

  unsubscribe: (id: string) => {
    const token = useAuthStore.getState().token;
    return api.post(`clubs/${id}/unsubscribe`, undefined, token ?? undefined);
  },
};
