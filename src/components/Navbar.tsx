/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, LogOut } from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { clearUser } = useUser();
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize theme state from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDarkMode =
      savedTheme === "dark" || (savedTheme === null && prefersDark);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(isDarkMode);

  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const newIsDark = !isDark;

    if (newIsDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(newIsDark);
  }, [isDark]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get("/api/users/logout");
      clearUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router, clearUser]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800">
      <Link href="/">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer">
          Notes
        </h1>
      </Link>
      <div className="ml-auto flex items-center justify-end gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle theme"
          type="button"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
        {pathname.startsWith("/notes") && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            type="button"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
}
