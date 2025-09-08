"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Settings {
  theme: "light" | "dark" | "system"
  notifications: boolean
  autoSave: boolean
  voiceToText: boolean
  exportFormat: "text" | "pdf"
  language: string
  fontSize: "small" | "medium" | "large"
}

interface SettingsStore {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  theme: "system",
  notifications: true,
  autoSave: true,
  voiceToText: false,
  exportFormat: "text",
  language: "en",
  fontSize: "medium",
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "managex-settings",
    },
  ),
)
