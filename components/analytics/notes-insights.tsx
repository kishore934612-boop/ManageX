"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import type { NoteAnalytics } from "@/lib/analytics"

interface NotesInsightsProps {
  analytics: NoteAnalytics
}

export function NotesInsights({ analytics }: NotesInsightsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Icons.notes className="h-4 w-4" />
            Notes Overview
          </CardTitle>
          <CardDescription>Your note-taking statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{analytics.totalNotes}</div>
              <div className="text-xs text-muted-foreground">Total Notes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{analytics.pinnedNotes}</div>
              <div className="text-xs text-muted-foreground">Pinned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{analytics.averageNoteLength}</div>
              <div className="text-xs text-muted-foreground">Avg Length</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Icons.calendar className="h-4 w-4" />
            Notes Created (7 Days)
          </CardTitle>
          <CardDescription>Daily note creation activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Notes Created",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[150px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.notesCreatedTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {analytics.mostUsedTags.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Icons.tag className="h-4 w-4" />
              Most Used Tags
            </CardTitle>
            <CardDescription>Your frequently used note tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.mostUsedTags.map((tag) => {
                const tagData = analytics.notesByTag.find((item) => item.tag === tag)
                return (
                  <Badge key={tag} variant="secondary">
                    {tag} ({tagData?.count || 0})
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
