"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/ui/icons"
import { useTaskStore } from "@/lib/task-store"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTask, deleteTask } = useTaskStore()
  const [showDetails, setShowDetails] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive"
      case "medium":
        return "bg-accent/10 text-accent"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getDueDateText = (dueDate?: Date) => {
    if (!dueDate) return null

    if (isToday(dueDate)) return "Today"
    if (isTomorrow(dueDate)) return "Tomorrow"
    if (isPast(dueDate)) return "Overdue"
    return format(dueDate, "MMM d")
  }

  const getDueDateColor = (dueDate?: Date) => {
    if (!dueDate) return "text-muted-foreground"
    if (isPast(dueDate) && !isToday(dueDate)) return "text-destructive"
    if (isToday(dueDate)) return "text-accent"
    return "text-muted-foreground"
  }

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", task.completed && "opacity-60")}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3
                className={cn(
                  "font-medium text-sm leading-tight",
                  task.completed && "line-through text-muted-foreground",
                )}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-1">
                <Badge className={cn("text-xs px-2 py-0.5", getPriorityColor(task.priority))}>{task.priority}</Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowDetails(!showDetails)}>
                  <Icons.more className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {task.dueDate && (
              <div className={cn("flex items-center gap-1 mt-1 text-xs", getDueDateColor(task.dueDate))}>
                <Icons.clock className="h-3 w-3" />
                <span>{getDueDateText(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {task.progress > 0 && task.progress < 100 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-muted-foreground">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1.5" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icons.tag className="h-3 w-3" />
              <span>{task.category}</span>
              {task.recurring && (
                <>
                  <Icons.clock className="h-3 w-3 ml-1" />
                  <span>Recurring</span>
                </>
              )}
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {showDetails && (
            <div className="pt-2 border-t space-y-2">
              {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => onEdit(task)}>
                  <Icons.edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive bg-transparent"
                  onClick={() => deleteTask(task.id)}
                >
                  <Icons.trash className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
