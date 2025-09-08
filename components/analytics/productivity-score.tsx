"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

interface ProductivityScoreProps {
  score: number
  completionRate: number
  overdueTasks: number
}

export function ProductivityScore({ score, completionRate, overdueTasks }: ProductivityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icons.dashboard className="h-4 w-4" />
          Productivity Score
        </CardTitle>
        <CardDescription>Your overall productivity performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={cn("text-3xl font-bold", getScoreColor(score))}>{Math.round(score)}</div>
            <div className="text-sm text-muted-foreground">{getScoreLabel(score)}</div>
          </div>

          <Progress value={score} className="h-2" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{Math.round(completionRate)}%</div>
              <div className="text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className={cn("font-semibold", overdueTasks > 0 ? "text-destructive" : "text-green-600")}>
                {overdueTasks}
              </div>
              <div className="text-muted-foreground">Overdue Tasks</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
