import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface CalendarConnection {
  id: string
  name: string
  email: string
  type: "google" | "outlook" | "notion"
  status: "connected" | "disconnected" | "connecting" | "error"
  lastSync?: Date
}

interface CalendarConnectProps {
  connections?: CalendarConnection[]
  onConnect?: (type: string) => void
  onDisconnect?: (id: string) => void
}

export function CalendarConnect({ 
  connections = [],
  onConnect,
  onDisconnect 
}: CalendarConnectProps) {
  const [connectingType, setConnectingType] = useState<string | null>(null)

  // todo: remove mock connection functionality
  const handleConnect = async (type: string) => {
    setConnectingType(type)
    console.log(`Connecting to ${type} calendar...`)
    
    // Simulate connection delay
    setTimeout(() => {
      setConnectingType(null)
      onConnect?.(type)
    }, 2000)
  }

  const handleDisconnect = (id: string) => {
    console.log(`Disconnecting calendar ${id}...`)
    onDisconnect?.(id)
  }

  const getStatusIcon = (status: CalendarConnection["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "connecting":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: CalendarConnection["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Connected</Badge>
      case "connecting":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Connecting</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Disconnected</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Connections
        </CardTitle>
        <CardDescription>
          Connect your calendar accounts to start tracking time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Google Calendar */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(connections.find(c => c.type === "google")?.status || "disconnected")}
              <div>
                <p className="font-medium">Google Calendar</p>
                {connections.find(c => c.type === "google") ? (
                  <p className="text-sm text-muted-foreground">
                    {connections.find(c => c.type === "google")?.email}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Not connected</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connections.find(c => c.type === "google") ? (
                <>
                  {getStatusBadge(connections.find(c => c.type === "google")?.status || "disconnected")}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(connections.find(c => c.type === "google")?.id || "")}
                    data-testid="button-disconnect-google"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleConnect("google")}
                  disabled={connectingType === "google"}
                  data-testid="button-connect-google"
                >
                  {connectingType === "google" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Outlook Calendar - Coming Soon */}
          <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Outlook Calendar</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">Soon</Badge>
          </div>

          {/* Notion Calendar - Coming Soon */}
          <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Notion Calendar</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">Soon</Badge>
          </div>
        </div>

        {connections.some(c => c.status === "connected") && (
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />
              Your calendar data will sync automatically every 15 minutes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}