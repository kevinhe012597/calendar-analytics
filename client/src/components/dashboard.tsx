import { useState, useEffect } from "react"
import { MetricCard } from "./metric-card"
import { TimeAllocationChart } from "./time-allocation-chart"
import { TrendChart } from "./trend-chart"
import { DailyTimeCharts } from "./daily-time-charts"
import { AiInsightsCard } from "./ai-insights-card"
import { CalendarManager } from "./calendar-manager"
import { EventCreator } from "./event-creator"
import { Clock, Target, TrendingUp, Calendar as CalendarIcon, Brain } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

export function Dashboard() {
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Fetch calendars to check if user has any
  const { data: calendars = [], isLoading: calendarsLoading } = useQuery({
    queryKey: ['/api/calendars'],
    staleTime: 30000
  })

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics'],
    staleTime: 60000,
    enabled: calendars.length > 0
  })

  // Use real analytics data
  const timeAllocationData = analyticsData?.timeAllocation || []
  const trendData = analyticsData?.trends || []
  const hasCalendars = calendars.length > 0

  // AI insights will be implemented in the next phase
  const aiInsights: any[] = []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">
          Calendar Analytics
        </h1>
        <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
          Track your time and get insights into your daily patterns
        </p>
      </div>

      {/* Calendar Management */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <CalendarManager />
        </div>
        <div className="space-y-4">
          <EventCreator />
        </div>
      </div>

      {/* Analytics Content */}
      {hasCalendars ? (
        <>
          {/* Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Hours"
              value={analyticsLoading ? "..." : `${analyticsData?.metrics?.totalHours || 0}h`}
              description="this week"
              trend="neutral"
              icon={<Clock className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Most Productive"
              value={analyticsLoading ? "..." : analyticsData?.metrics?.mostProductiveDay || "N/A"}
              description="based on calendar events"
              trend="neutral"
              icon={<Target className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Events Tracked"
              value={analyticsLoading ? "..." : analyticsData?.metrics?.eventsCount?.toString() || "0"}
              description="last 7 days"
              trend="neutral"
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Categories"
              value={timeAllocationData.length.toString()}
              description="event types identified"
              trend="neutral"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

          {/* Charts */}
          {timeAllocationData.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TimeAllocationChart 
                  data={timeAllocationData}
                  title="Weekly Time Allocation"
                  description="Last 7 days"
                />
                
                <TrendChart 
                  data={trendData}
                  title="Weekly Activity Trends"
                  description="Daily hours by category"
                />
              </div>

              {/* Enhanced Daily & Weekly Analysis */}
              <DailyTimeCharts 
                weeklyData={timeAllocationData}
                dailyTrendsData={trendData}
              />
            </div>
          )}

          {/* AI Insights Placeholder */}
          <AiInsightsCard 
            insights={aiInsights}
            isLoading={false}
          />
        </>
      ) : calendarsLoading ? (
        <div className="text-center py-12 space-y-4" data-testid="loading-state">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your calendars...</p>
        </div>
      ) : (
        /* Welcome State */
        <div className="text-center py-12 space-y-4" data-testid="welcome-state">
          <Brain className="h-16 w-16 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold" data-testid="text-welcome-title">
              Welcome to Calendar Analytics
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-welcome-description">
              Create your first calendar and start adding events to see detailed analytics 
              and insights about how you spend your time.
            </p>
          </div>
        </div>
      )}
      
      {/* No events message */}
      {hasCalendars && timeAllocationData.length === 0 && !analyticsLoading && (
        <div className="text-center py-8 space-y-4" data-testid="no-events-state">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">No Events Yet</h3>
            <p className="text-muted-foreground">
              Add some events to your calendars to see analytics and insights.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}