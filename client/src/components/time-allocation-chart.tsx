import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TimeAllocationData {
  category: string
  hours: number
  color: string
}

interface TimeAllocationChartProps {
  data?: TimeAllocationData[]
  title?: string
  description?: string
}

const COLORS = {
  work: "hsl(var(--chart-2))",
  exercise: "hsl(var(--chart-1))", 
  social: "hsl(var(--chart-3))",
  rest: "hsl(var(--chart-4))",
  other: "hsl(var(--chart-5))"
}

export function TimeAllocationChart({ 
  data = [],
  title = "Time Allocation",
  description = "This week"
}: TimeAllocationChartProps) {
  const totalHours = data.reduce((sum, item) => sum + item.hours, 0)
  
  const formatTooltip = (value: number, name: string) => {
    const percentage = ((value / totalHours) * 100).toFixed(1)
    return [`${value}h (${percentage}%)`, name]
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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="hours"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.category as keyof typeof COLORS] || COLORS.other}
                  />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ 
                    backgroundColor: COLORS[item.category as keyof typeof COLORS] || COLORS.other 
                  }}
                />
                <span className="capitalize">{item.category}</span>
              </div>
              <div className="flex gap-2 text-muted-foreground">
                <span>{item.hours}h</span>
                <span>({((item.hours / totalHours) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}