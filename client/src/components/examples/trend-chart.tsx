import { TrendChart } from "../trend-chart"

// todo: remove mock data
const mockTrendData = [
  { date: "Mon", work: 8, exercise: 1, social: 2, rest: 3 },
  { date: "Tue", work: 7, exercise: 1.5, social: 1, rest: 4 },
  { date: "Wed", work: 9, exercise: 0.5, social: 3, rest: 2.5 },
  { date: "Thu", work: 6, exercise: 2, social: 2, rest: 4 },
  { date: "Fri", work: 8, exercise: 1, social: 4, rest: 2 },
  { date: "Sat", work: 2, exercise: 2, social: 6, rest: 5 },
  { date: "Sun", work: 1, exercise: 1.5, social: 3, rest: 6 }
]

export default function TrendChartExample() {
  return (
    <div className="w-full max-w-2xl">
      <TrendChart 
        data={mockTrendData}
        title="Weekly Activity Trends"
        description="Daily hours by category"
      />
    </div>
  )
}