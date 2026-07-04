"use client";

import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type User = {
  _id: string;
  username: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  loadingUser: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshUser = useCallback(async () => {
    try {
      setLoadingUser(true);
      const response = await axios.get("/api/users/me");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const response = await axios.get("/api/users/me");
        if (mounted) {
          setUser(response.data);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    };

    void loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ user, loadingUser, searchQuery, setSearchQuery, refreshUser, clearUser }),
    [user, loadingUser, searchQuery, refreshUser, clearUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
