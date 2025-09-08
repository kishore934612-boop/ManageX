"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Note } from "./types"

interface NoteStore {
  notes: Note[]
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  togglePin: (id: string) => void
  getAllTags: () => string[]
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ notes: [newNote, ...state.notes] }))
      },
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note)),
        }))
      },
      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }))
      },
      togglePin: (id) => {
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)),
        }))
      },
      getAllTags: () => {
        const { notes } = get()
        const allTags = notes.flatMap((note) => note.tags)
        return Array.from(new Set(allTags)).sort()
      },
    }),
    {
      name: "managex-notes",
    },
  ),
)
