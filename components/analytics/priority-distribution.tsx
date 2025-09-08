"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Icons } from "@/components/ui/icons"

interface PriorityDistributionProps {
  data: { priority: string; count: number; percentage: number }[]
}

const COLORS = {
  High: "hsl(var(--destructive))",
  Medium: "hsl(var(--chart-2))",
  Low: "hsl(var(--muted-foreground))",
}

export function PriorityDistribution({ data }: PriorityDistributionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icons.tag className="h-4 w-4" />
          Priority Distribution
        </CardTitle>
        <CardDescription>Tasks breakdown by priority level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <ChartContainer
            config={{
              high: { label: "High", color: COLORS.High },
              medium: { label: "Medium", color: COLORS.Medium },
              low: { label: "Low", color: COLORS.Low },
            }}
            className="h-[150px] w-[150px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="count">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.priority as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.priority} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[item.priority as keyof typeof COLORS] }}
                />
                <span className="font-medium">{item.priority}</span>
                <span className="text-muted-foreground">
                  {item.count} ({Math.round(item.percentage)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
