import { MetricCard } from "../metric-card"
import { Clock, Target, TrendingUp, Calendar } from "lucide-react"

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <MetricCard
        title="Total Hours"
        value="42.5h"
        description="this week"
        trend="up"
        trendValue="+2.5h from last week"
        icon={<Clock className="h-4 w-4" />}
      />
      
      <MetricCard
        title="Most Productive"
        value="Tuesday"
        description="9.2 hours focused work"
        trend="neutral"
        icon={<Target className="h-4 w-4" />}
      />
      
      <MetricCard
        title="Focus Score"
        value="85%"
        description="vs 78% last week"
        trend="up"
        trendValue="+7%"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      
      <MetricCard
        title="Events Tracked"
        value="127"
        description="this month"
        trend="up"
        trendValue="+15 events"
        icon={<Calendar className="h-4 w-4" />}
      />
    </div>
  )
}