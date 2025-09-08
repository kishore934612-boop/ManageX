"use client"

import { useState, useMemo } from "react"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskFilters } from "@/components/tasks/task-filters"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useTaskStore } from "@/lib/task-store"
import type { Task } from "@/lib/types"

export default function DashboardPage() {
  const { tasks } = useTaskStore()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [showCompleted, setShowCompleted] = useState(true)

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory = selectedCategory === "all" || task.category === selectedCategory
        const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
        const matchesCompleted = showCompleted || !task.completed

        return matchesSearch && matchesCategory && matchesPriority && matchesCompleted
      })
      .sort((a, b) => {
        // Sort by priority (high -> medium -> low), then by due date
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]

        if (priorityDiff !== 0) return priorityDiff

        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [tasks, searchQuery, selectedCategory, selectedPriority, showCompleted])

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(undefined)
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const totalCount = tasks.length

  if (showTaskForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <TaskForm task={editingTask} onClose={handleCloseForm} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <Button size="icon" className="rounded-full" onClick={() => setShowTaskForm(true)}>
            <Icons.plus className="h-5 w-5" />
          </Button>
        </header>

        <div className="space-y-4">
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            showCompleted={showCompleted}
            onShowCompletedChange={setShowCompleted}
          />

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Icons.tasks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {tasks.length === 0
                  ? "Create your first task to get started"
                  : "Try adjusting your filters or search query"}
              </p>
              {tasks.length === 0 && (
                <Button onClick={() => setShowTaskForm(true)}>
                  <Icons.plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
