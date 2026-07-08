"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, LogOut, X, Zap, ChevronDown, Settings } from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { user, clearUser, searchQuery, setSearchQuery } = useUser();
  const [isDark, setIsDark] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
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

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

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

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        console.log("Updating search query:", value);
        setSearchQuery(value);
      }, 300);
    },
    [setSearchQuery],
  );

  useEffect(() => {

    if (searchInput.trim() && !isSearchActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSearchActive(true);
    }
    
    if (searchInput === '' && isSearchActive) {
      setIsSearchActive(false);
    }
  }, [searchInput, isSearchActive]);

  return (
    <nav className="flex flex-row md:flex-row items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800 gap-3 md:gap-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2 shrink-0">
        <Zap className="w-6 h-6 text-yellow-500" />
        <Link href="/">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap">
            Scripta
          </h1>
        </Link>
      </div>

      {/* Search Bar */}
      {pathname.startsWith("/scripts") && (
        <div className="relative w-full grow md:w-auto md:flex-1 md:mx-6 md:max-w-xl">
          <input
            placeholder="Search scripts..."
            value={searchInput}
            onChange={(e) => {
              handleSearchChange(e.target.value);
            }}
            onFocus={() => setIsSearchActive(true)}
            className="w-full rounded-md bg-gray-100 px-3 py-2 pr-10 font-medium text-sm md:text-base transition-colors active:border-0 dark:bg-zinc-700 dark:text-white"
            type="text"
          />
          {isSearchActive && (
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-800"
              aria-label="Clear search"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setIsSearchActive(false);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Right Section - Theme & Profile */}
      <div className="flex items-center justify-end gap-2 md:gap-3 shrink-1">
        {/* Profile Dropdown */}
        {pathname.startsWith("/scripts") && user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
              type="button"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline truncate max-w-[100px]">
                {user.username || "User"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username || "User"}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                </div>

                <Link href="/profile">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    type="button"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                </Link>

                <button
                  onClick={() => {
                    toggleTheme();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                  type="button"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors border-t border-gray-200 dark:border-gray-700"
                  type="button"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}