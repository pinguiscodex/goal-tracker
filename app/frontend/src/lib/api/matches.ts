import api from "./client";
import { useAuthStore } from "./auth-store";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "completed"
  | "cancelled";
export type MatchType = "league" | "cup" | "friendly" | "tournament";

export interface Match {
  id: string;
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamClubId?: string;
  awayTeamClubId?: string;
  homeGoals: number;
  awayGoals: number;
  status: MatchStatus;
  matchType: MatchType;
  scheduledStartTime?: string;
  actualStartTime?: string;
  endTime?: string;
  halfDuration: number;
  currentMinute: number;
  currentHalf: number;
  venue?: string;
  referee?: string;
  tournamentId?: string;
  createdAt?: string;
  homeTeamClub?: { id: string; name: string; logo?: string };
  awayTeamClub?: { id: string; name: string; logo?: string };
  events?: MatchEvent[];
}

export interface MatchEvent {
  id: string;
  type:
    | "goal"
    | "own_goal"
    | "penalty_scored"
    | "penalty_missed"
    | "yellow_card"
    | "red_card"
    | "second_yellow"
    | "substitution"
    | "injury"
    | "var"
    | "commentary";
  team: "home" | "away";
  minute: number;
  extraMinute?: number;
  playerName?: string;
  description?: string;
}

export interface CreateMatchData {
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamClubId?: string;
  awayTeamClubId?: string;
  matchType?: MatchType;
  scheduledStartTime?: string;
  halfDuration?: number;
  halfTimeDuration?: number;
  venue?: string;
  referee?: string;
  notes?: string;
  tournamentId?: string;
}

export const matchesApi = {
  getAll: (status?: MatchStatus) => {
    const query = status ? `?status=${status}` : "";
    return api.get<Match[]>(`matches${query}`);
  },

  getOngoing: () => api.get<Match[]>("matches/ongoing"),

  getById: (id: string) => api.get<Match>(`matches/${id}`),

  getByClub: (clubId: string) => api.get<Match[]>(`matches/club/${clubId}`),

  getByTournament: (tournamentId: string) =>
    api.get<Match[]>(`matches/tournament/${tournamentId}`),

  create: (data: CreateMatchData) => {
    const token = useAuthStore.getState().token;
    return api.post<Match>("matches", data, token ?? undefined);
  },

  start: (id: string) => {
    const token = useAuthStore.getState().token;
    return api.post<Match>(
      `matches/${id}/start`,
      undefined,
      token ?? undefined
    );
  },

  updateGoals: (
    id: string,
    goals: { homeGoals?: number; awayGoals?: number }
  ) => {
    const token = useAuthStore.getState().token;
    return api.patch<Match>(`matches/${id}/goals`, goals, token ?? undefined);
  },

  setHalftime: (id: string) => {
    const token = useAuthStore.getState().token;
    return api.post<Match>(
      `matches/${id}/halftime`,
      undefined,
      token ?? undefined
    );
  },

  resume: (id: string) => {
    const token = useAuthStore.getState().token;
    return api.post<Match>(
      `matches/${id}/resume`,
      undefined,
      token ?? undefined
    );
  },

  end: (id: string) => {
    const token = useAuthStore.getState().token;
    return api.post<Match>(`matches/${id}/end`, undefined, token ?? undefined);
  },

  cancel: (id: string) => {
    const token = useAuthStore.getState().token;
    return api.post<Match>(
      `matches/${id}/cancel`,
      undefined,
      token ?? undefined
    );
  },

  addEvent: (id: string, event: Omit<MatchEvent, "id">) => {
    const token = useAuthStore.getState().token;
    return api.post<MatchEvent>(
      `matches/${id}/events`,
      event,
      token ?? undefined
    );
  },
};
