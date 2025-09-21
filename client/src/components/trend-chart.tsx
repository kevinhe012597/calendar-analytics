import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TrendData {
  date: string
  work: number
  exercise: number
  social: number
  rest: number
}

interface TrendChartProps {
  data?: TrendData[]
  title?: string
  description?: string
}

const CATEGORY_COLORS = {
  work: "hsl(var(--chart-2))",
  exercise: "hsl(var(--chart-1))",
  social: "hsl(var(--chart-3))",
  rest: "hsl(var(--chart-4))"
}

export function TrendChart({ 
  data = [],
  title = "Weekly Trends",
  description = "Hours spent per category over time"
}: TrendChartProps) {
  const formatTooltip = (value: number, name: string) => {
    return [`${value}h`, name.charAt(0).toUpperCase() + name.slice(1)]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
              <Legend />
              {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}