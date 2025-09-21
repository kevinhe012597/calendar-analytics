import { AiInsightsCard } from "../ai-insights-card"

// todo: remove mock data
const mockInsights = [
  {
    id: "1",
    type: "productivity" as const,
    title: "Peak Productivity Hours",
    description: "You're most productive between 9-11 AM. Consider scheduling important tasks during this time.",
    confidence: "high" as const,
    category: "work"
  },
  {
    id: "2", 
    type: "pattern" as const,
    title: "Meeting Overload on Wednesdays",
    description: "You have 40% more meetings on Wednesdays than other days. This might be fragmenting your focus time.",
    confidence: "high" as const,
    category: "work"
  },
  {
    id: "3",
    type: "recommendation" as const,
    title: "Exercise Consistency",
    description: "Your exercise schedule is inconsistent. Try blocking the same time slot each day for better habit formation.",
    confidence: "medium" as const,
    category: "exercise"
  }
]

export default function AiInsightsCardExample() {
  return (
    <div className="w-full max-w-md space-y-6">
      <AiInsightsCard insights={mockInsights} />
      <AiInsightsCard insights={[]} title="No Insights Yet" />
      <AiInsightsCard isLoading={true} title="Loading Insights" />
    </div>
  )
}