"use client";

import { useCallback, useState } from "react";

interface UseThemeReturn {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const THEME_STORAGE_KEY = "dotr_portal_theme";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return stored === "dark" || (!stored && prefersDark);
}

function initTheme() {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", getInitialTheme());
}

export function useTheme(): UseThemeReturn {
  const [isDark, setIsDark] = useState(getInitialTheme);

  if (typeof window !== "undefined") {
    initTheme();
  }

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  const setTheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  }, []);

  return { isDark, toggleTheme, setTheme };
}
