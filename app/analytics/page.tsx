"use client"

import { useMemo } from "react"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { ProductivityScore } from "@/components/analytics/productivity-score"
import { TaskCompletionChart } from "@/components/analytics/task-completion-chart"
import { PriorityDistribution } from "@/components/analytics/priority-distribution"
import { CategoryBreakdown } from "@/components/analytics/category-breakdown"
import { NotesInsights } from "@/components/analytics/notes-insights"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useTaskStore } from "@/lib/task-store"
import { useNoteStore } from "@/lib/note-store"
import { calculateTaskAnalytics, calculateNoteAnalytics } from "@/lib/analytics"

export default function AnalyticsPage() {
  const { tasks } = useTaskStore()
  const { notes } = useNoteStore()

  const taskAnalytics = useMemo(() => calculateTaskAnalytics(tasks), [tasks])
  const noteAnalytics = useMemo(() => calculateNoteAnalytics(notes), [notes])

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Insights into your productivity and habits</p>
        </header>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icons.tasks className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-lg font-bold">{taskAnalytics.totalTasks}</div>
                    <div className="text-xs text-muted-foreground">Total Tasks</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icons.notes className="h-4 w-4 text-accent" />
                  <div>
                    <div className="text-lg font-bold">{noteAnalytics.totalNotes}</div>
                    <div className="text-xs text-muted-foreground">Total Notes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productivity Score */}
          <ProductivityScore
            score={taskAnalytics.productivityScore}
            completionRate={taskAnalytics.completionRate}
            overdueTasks={taskAnalytics.overdueTasks}
          />

          {/* Task Analytics */}
          {tasks.length > 0 && (
            <>
              <TaskCompletionChart data={taskAnalytics.completionTrend} />

              <div className="grid grid-cols-1 gap-4">
                {taskAnalytics.tasksByPriority.length > 0 && (
                  <PriorityDistribution data={taskAnalytics.tasksByPriority} />
                )}

                {taskAnalytics.tasksByCategory.length > 0 && <CategoryBreakdown data={taskAnalytics.tasksByCategory} />}
              </div>
            </>
          )}

          {/* Notes Analytics */}
          {notes.length > 0 && <NotesInsights analytics={noteAnalytics} />}

          {/* Empty State */}
          {tasks.length === 0 && notes.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Icons.dashboard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Data Yet</h3>
                <p className="text-muted-foreground">
                  Start creating tasks and notes to see your productivity analytics here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
