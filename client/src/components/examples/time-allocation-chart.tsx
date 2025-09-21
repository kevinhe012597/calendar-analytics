import { TimeAllocationChart } from "../time-allocation-chart"

// todo: remove mock data
const mockData = [
  { category: "work", hours: 35, color: "#3b82f6" },
  { category: "exercise", hours: 8, color: "#10b981" },
  { category: "social", hours: 12, color: "#8b5cf6" },
  { category: "rest", hours: 20, color: "#06b6d4" },
  { category: "other", hours: 5, color: "#f59e0b" }
]

export default function TimeAllocationChartExample() {
  return (
    <div className="w-full max-w-md">
      <TimeAllocationChart 
        data={mockData}
        title="Weekly Time Allocation"
        description="Last 7 days"
      />
    </div>
  )
}