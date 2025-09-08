"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { useTaskStore } from "@/lib/task-store"

interface TaskFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedPriority: string
  onPriorityChange: (priority: string) => void
  showCompleted: boolean
  onShowCompletedChange: (show: boolean) => void
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  showCompleted,
  onShowCompletedChange,
}: TaskFiltersProps) {
  const { categories } = useTaskStore()
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    onSearchChange("")
    onCategoryChange("all")
    onPriorityChange("all")
    onShowCompletedChange(true)
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedPriority !== "all" || !showCompleted

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-accent" : ""}
        >
          <Icons.filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={selectedPriority} onValueChange={onPriorityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showCompleted"
                checked={showCompleted}
                onChange={(e) => onShowCompletedChange(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showCompleted" className="text-sm">
                Show completed tasks
              </label>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Icons.x className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1">
              {searchQuery && (
                <Badge variant="secondary">
                  Search: {searchQuery}
                  <Icons.x className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onSearchChange("")} />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary">
                  Category: {selectedCategory}
                  <Icons.x className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onCategoryChange("all")} />
                </Badge>
              )}
              {selectedPriority !== "all" && (
                <Badge variant="secondary">
                  Priority: {selectedPriority}
                  <Icons.x className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onPriorityChange("all")} />
                </Badge>
              )}
              {!showCompleted && (
                <Badge variant="secondary">
                  Hide completed
                  <Icons.x className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onShowCompletedChange(true)} />
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
