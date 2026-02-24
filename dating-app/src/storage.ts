import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  email: string;
}

export interface Like {
  fromUserId: string;
  toUserId: string;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  timestamp: number;
}

export interface Availability {
  date: string; // YYYY-MM-DD
  startHour: number; // 0-23
  endHour: number; // 0-23
}

export interface UserAvailability {
  matchId: string;
  userId: string;
  availabilities: Availability[];
}

const KEYS = {
  CURRENT_USER: "clique_current_user",
};

// API powered storage
export const storage = {
  // Current user logic uses localStorage on the client for convenience
  getCurrentUserId: () => localStorage.getItem(KEYS.CURRENT_USER),
  setCurrentUserId: (id: string | null) => {
    if (id) localStorage.setItem(KEYS.CURRENT_USER, id);
    else localStorage.removeItem(KEYS.CURRENT_USER);
  },

  // Auth
  login: async (
    username: string,
    password: string,
  ): Promise<{ id: string; error?: string }> => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      return res.data;
    } catch {
      return { id: "", error: "Network error" };
    }
  },
  register: async (
    username: string,
    password: string,
  ): Promise<{ id: string; error?: string }> => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });
      return res.data;
    } catch {
      return { id: "", error: "Network error" };
    }
  },

  // Profiles
  getProfiles: async (): Promise<Profile[]> => {
    try {
      const res = await axios.get(`${API_URL}/profiles`);
      return res.data;
    } catch {
      return [];
    }
  },
  saveProfile: async (profile: Profile): Promise<void> => {
    await axios.post(`${API_URL}/profiles`, profile);
  },
  getProfile: async (id: string): Promise<Profile | null> => {
    const profiles = await storage.getProfiles();
    return profiles.find((p) => p.id === id) || null;
  },

  // Likes & Matches
  getLikes: async (): Promise<Like[]> => {
    try {
      const res = await axios.get(`${API_URL}/likes`);
      return res.data;
    } catch {
      return [];
    }
  },
  addLike: async (fromId: string, toId: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_URL}/likes`, {
        fromUserId: fromId,
        toUserId: toId,
      });
      return Boolean(res.data);
    } catch {
      return false;
    }
  },

  getMatches: async (): Promise<Match[]> => {
    try {
      const res = await axios.get(`${API_URL}/matches`);
      return res.data;
    } catch {
      return [];
    }
  },
  getMatchesForUser: async (userId: string): Promise<Match[]> => {
    const matches = await storage.getMatches();
    return matches.filter((m) => m.user1Id === userId || m.user2Id === userId);
  },

  // Availabilities
  getAvailabilities: async (): Promise<UserAvailability[]> => {
    try {
      const res = await axios.get(`${API_URL}/availabilities`);
      return res.data;
    } catch {
      return [];
    }
  },
  getAvailabilitiesForMatch: async (
    matchId: string,
  ): Promise<UserAvailability[]> => {
    const all = await storage.getAvailabilities();
    return all.filter((a) => a.matchId === matchId);
  },
  saveAvailability: async (
    matchId: string,
    userId: string,
    availabilities: Availability[],
  ): Promise<void> => {
    try {
      await axios.post(`${API_URL}/availabilities`, {
        matchId,
        userId,
        availabilities,
      });
    } catch (e) {
      console.error("Error saving availability", e);
    }
  },
};
