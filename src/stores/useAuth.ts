import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

interface UserProfile {
  fullName: string;
  birthDate: string | null;
  gender: "male" | "female" | null;
  education: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  photoUrl: string | null;
} 

interface Company {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  logoUrl: string | null;
}

export interface UserAuth {
  id: string;
  email: string;
  role: "user" | "admin" | "dev";
  isVerified: boolean;
  companyId: string | null;
  provider: string | null;
  createdAt: string;
  profile: UserProfile | null;
  company: Company | null;
}

type Store = {
  user: UserAuth | null;
  login: (user: UserAuth) => void;
  logout: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: async () => {
        await axiosInstance.post("/auth/logout");
        set({ user: null });
        window.location.href = "/login";
      },
    }),
    { name: "auth" },
  ),
);
