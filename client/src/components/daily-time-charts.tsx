import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3 } from "lucide-react"

interface DailyTimeChartsProps {
  weeklyData?: Array<{ category: string; hours: number; color: string }>
  dailyTrendsData?: Array<{ date: string; [category: string]: any }>
}

const COLORS = {
  work: "hsl(var(--chart-2))",
  exercise: "hsl(var(--chart-1))", 
  social: "hsl(var(--chart-3))",
  rest: "hsl(var(--chart-4))",
  other: "hsl(var(--chart-5))"
}

const CATEGORY_COLORS = {
  work: '#3b82f6',
  exercise: '#10b981', 
  social: '#8b5cf6',
  rest: '#06b6d4',
  other: '#f59e0b'
}

export function DailyTimeCharts({ weeklyData = [], dailyTrendsData = [] }: DailyTimeChartsProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')

  // Process daily data for individual pie charts
  const processDailyData = () => {
    const dailyCharts: { [day: string]: Array<{ category: string; hours: number }> } = {}
    
    dailyTrendsData.forEach(dayData => {
      const { date, ...categories } = dayData
      dailyCharts[date] = Object.entries(categories)
        .filter(([_, hours]) => typeof hours === 'number' && hours > 0)
        .map(([category, hours]) => ({
          category,
          hours: Math.round((hours as number) * 10) / 10
        }))
    })
    
    return dailyCharts
  }

  // Process data for weekly histogram
  const processWeeklyHistogram = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const categories = ['work', 'exercise', 'social', 'rest', 'other']
    
    return daysOfWeek.map(day => {
      const dayData: { [key: string]: any } = dailyTrendsData.find(d => d.date === day) || {}
      const result: { [key: string]: any } = { day }
      
      categories.forEach(category => {
        result[category] = Math.round(((dayData[category] as number) || 0) * 10) / 10
      })
      
      return result
    })
  }

  const dailyCharts = processDailyData()
  const histogramData = processWeeklyHistogram()

  const formatTooltip = (value: number, name: string) => {
    return [`${value}h`, name?.charAt(0).toUpperCase() + name?.slice(1)]
  }

  const formatBarTooltip = (value: number, name: string) => {
    return [`${value}h`, name?.charAt(0).toUpperCase() + name?.slice(1)]
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Time Analysis</h3>
          <p className="text-sm text-muted-foreground">
            {viewMode === 'daily' ? 'Daily breakdown by category' : 'Weekly activity patterns'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('daily')}
            data-testid="button-daily-view"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Daily
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('weekly')}
            data-testid="button-weekly-view"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Weekly
          </Button>
        </div>
      </div>

      {/* Daily Pie Charts View */}
      {viewMode === 'daily' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(dailyCharts).map(([day, data]) => {
            if (data.length === 0) return null
            
            const totalHours = data.reduce((sum, item) => sum + item.hours, 0)
            
            return (
              <Card key={day} data-testid={`daily-chart-${day.toLowerCase()}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{day}</CardTitle>
                  <CardDescription className="text-xs">
                    {totalHours.toFixed(1)}h total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={70}
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
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {data.map((item) => (
                      <div key={item.category} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div 
                            className="w-2 h-2 rounded-sm"
                            style={{ 
                              backgroundColor: COLORS[item.category as keyof typeof COLORS] || COLORS.other 
                            }}
                          />
                          <span className="capitalize">{item.category}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {item.hours}h ({((item.hours / totalHours) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Weekly Histogram View */}
      {viewMode === 'weekly' && (
        <Card data-testid="weekly-histogram">
          <CardHeader>
            <CardTitle>Weekly Activity Histogram</CardTitle>
            <CardDescription>Daily hours by category across the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={formatBarTooltip} />
                  <Legend />
                  
                  <Bar dataKey="work" stackId="a" fill={CATEGORY_COLORS.work} name="Work" />
                  <Bar dataKey="exercise" stackId="a" fill={CATEGORY_COLORS.exercise} name="Exercise" />
                  <Bar dataKey="social" stackId="a" fill={CATEGORY_COLORS.social} name="Social" />
                  <Bar dataKey="rest" stackId="a" fill={CATEGORY_COLORS.rest} name="Rest" />
                  <Bar dataKey="other" stackId="a" fill={CATEGORY_COLORS.other} name="Other" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              {Object.entries(CATEGORY_COLORS).map(([category, color]) => {
                const totalHours = histogramData.reduce((sum, day) => sum + (day[category] || 0), 0)
                return (
                  <div key={category} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="capitalize">{category}</span>
                    <span className="text-muted-foreground">({totalHours.toFixed(1)}h)</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {Object.keys(dailyCharts).length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No time data available. Add some events to see daily and weekly breakdowns.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}