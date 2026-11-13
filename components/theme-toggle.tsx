
"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("theme-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    );

    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}

    window.dispatchEvent(new Event("theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition hover:border-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
    >
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
