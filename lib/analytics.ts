import type { Task, Note } from "./types"
import { format, subDays, isWithinInterval } from "date-fns"

export interface TaskAnalytics {
  totalTasks: number
  completedTasks: number
  completionRate: number
  overdueTasks: number
  tasksByPriority: { priority: string; count: number; percentage: number }[]
  tasksByCategory: { category: string; count: number; percentage: number }[]
  completionTrend: { date: string; completed: number; created: number }[]
  productivityScore: number
}

export interface NoteAnalytics {
  totalNotes: number
  pinnedNotes: number
  averageNoteLength: number
  notesByTag: { tag: string; count: number }[]
  notesCreatedTrend: { date: string; count: number }[]
  mostUsedTags: string[]
}

export function calculateTaskAnalytics(tasks: Task[]): TaskAnalytics {
  const now = new Date()
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < now && !task.completed).length

  // Priority distribution
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const tasksByPriority = Object.entries(priorityCounts).map(([priority, count]) => ({
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    count,
    percentage: totalTasks > 0 ? (count / totalTasks) * 100 : 0,
  }))

  // Category distribution
  const categoryCounts = tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const tasksByCategory = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: totalTasks > 0 ? (count / totalTasks) * 100 : 0,
  }))

  // Completion trend (last 7 days)
  const completionTrend = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(now, 6 - i)
    const dateStr = format(date, "MMM dd")
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)

    const completed = tasks.filter(
      (task) =>
        task.completed &&
        task.updatedAt &&
        isWithinInterval(new Date(task.updatedAt), { start: dayStart, end: dayEnd }),
    ).length

    const created = tasks.filter((task) =>
      isWithinInterval(new Date(task.createdAt), { start: dayStart, end: dayEnd }),
    ).length

    return { date: dateStr, completed, created }
  })

  // Productivity score (0-100 based on completion rate, overdue tasks, etc.)
  let productivityScore = completionRate
  if (overdueTasks > 0) {
    productivityScore -= (overdueTasks / totalTasks) * 20 // Penalty for overdue tasks
  }
  productivityScore = Math.max(0, Math.min(100, productivityScore))

  return {
    totalTasks,
    completedTasks,
    completionRate,
    overdueTasks,
    tasksByPriority,
    tasksByCategory,
    completionTrend,
    productivityScore,
  }
}

export function calculateNoteAnalytics(notes: Note[]): NoteAnalytics {
  const totalNotes = notes.length
  const pinnedNotes = notes.filter((note) => note.isPinned).length

  // Average note length
  const totalLength = notes.reduce((acc, note) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = note.content
    const textContent = tmp.textContent || tmp.innerText || ""
    return acc + textContent.length
  }, 0)
  const averageNoteLength = totalNotes > 0 ? Math.round(totalLength / totalNotes) : 0

  // Notes by tag
  const tagCounts = notes.reduce(
    (acc, note) => {
      note.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const notesByTag = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)

  // Notes created trend (last 7 days)
  const now = new Date()
  const notesCreatedTrend = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(now, 6 - i)
    const dateStr = format(date, "MMM dd")
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)

    const count = notes.filter((note) =>
      isWithinInterval(new Date(note.createdAt), { start: dayStart, end: dayEnd }),
    ).length

    return { date: dateStr, count }
  })

  // Most used tags (top 5)
  const mostUsedTags = notesByTag.slice(0, 5).map((item) => item.tag)

  return {
    totalNotes,
    pinnedNotes,
    averageNoteLength,
    notesByTag,
    notesCreatedTrend,
    mostUsedTags,
  }
}
