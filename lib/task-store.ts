"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, Category } from "./types"

interface TaskStore {
  tasks: Task[]
  categories: Category[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
}

const defaultCategories: Category[] = [
  { id: "1", name: "Work", color: "#059669", icon: "briefcase" },
  { id: "2", name: "Personal", color: "#10b981", icon: "user" },
  { id: "3", name: "Health", color: "#06b6d4", icon: "heart" },
  { id: "4", name: "Learning", color: "#8b5cf6", icon: "book" },
]

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: defaultCategories,
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)),
        }))
      },
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
      },
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : 0, updatedAt: new Date() }
              : task,
          ),
        }))
      },
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: crypto.randomUUID(),
        }
        set((state) => ({ categories: [...state.categories, newCategory] }))
      },
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) => (category.id === id ? { ...category, ...updates } : category)),
        }))
      },
      deleteCategory: (id) => {
        set((state) => ({ categories: state.categories.filter((category) => category.id !== id) }))
      },
    }),
    {
      name: "managex-tasks",
    },
  ),
)
