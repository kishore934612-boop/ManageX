export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  priority: "high" | "medium" | "low"
  category: string
  tags: string[]
  completed: boolean
  recurring?: {
    type: "daily" | "weekly" | "monthly"
    interval: number
  }
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface Note {
  id: string
  title: string
  content: string
  isPinned: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
  color?: string
}

export interface NoteFilter {
  searchQuery: string
  showPinned: boolean
  selectedTags: string[]
}
