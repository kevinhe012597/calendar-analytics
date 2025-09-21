import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, TrendingUp } from "lucide-react"

interface Insight {
  id: string
  type: "productivity" | "pattern" | "recommendation"
  title: string
  description: string
  confidence: "high" | "medium" | "low"
  category?: string
}

interface AiInsightsCardProps {
  insights?: Insight[]
  title?: string
  isLoading?: boolean
}

const getInsightIcon = (type: Insight["type"]) => {
  switch (type) {
    case "productivity":
      return <TrendingUp className="h-4 w-4" />
    case "pattern":
      return <Brain className="h-4 w-4" />
    case "recommendation":
      return <Lightbulb className="h-4 w-4" />
  }
}

const getConfidenceColor = (confidence: Insight["confidence"]) => {
  switch (confidence) {
    case "high":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "low":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

export function AiInsightsCard({ 
  insights = [], 
  title = "AI Insights",
  isLoading = false 
}: AiInsightsCardProps) {
  // todo: remove mock loading functionality
  const handleRefreshInsights = () => {
    console.log("Refreshing AI insights...")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>Analyzing your time patterns...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>AI-powered insights from your calendar data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No insights available yet</p>
              <p className="text-xs">Connect your calendar to get AI insights</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div 
                key={insight.id} 
                className="border rounded-lg p-3 space-y-2"
                data-testid={`insight-${insight.type}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getConfidenceColor(insight.confidence)}
                  >
                    {insight.confidence}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
                {insight.category && (
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {insight.category}
                    </Badge>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {insights.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <button 
              onClick={handleRefreshInsights}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-refresh-insights"
            >
              Refresh insights
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}