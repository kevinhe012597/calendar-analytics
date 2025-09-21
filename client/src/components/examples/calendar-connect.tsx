import { useState } from "react"
import { CalendarConnect } from "../calendar-connect"

// todo: remove mock data and functionality
const initialConnections = [
  {
    id: "google-1",
    name: "Google Calendar",
    email: "john.doe@gmail.com",
    type: "google" as const,
    status: "connected" as const,
    lastSync: new Date()
  }
]

export default function CalendarConnectExample() {
  const [connections, setConnections] = useState(initialConnections)

  const handleConnect = (type: string) => {
    console.log(`Connected to ${type}`)
    setConnections([
      ...connections,
      {
        id: `${type}-${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Calendar`,
        email: `user@${type}.com`,
        type: type as any,
        status: "connected" as const,
        lastSync: new Date()
      }
    ])
  }

  const handleDisconnect = (id: string) => {
    console.log(`Disconnected ${id}`)
    setConnections(connections.filter(c => c.id !== id))
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <CalendarConnect 
        connections={connections}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      
      <CalendarConnect 
        connections={[]}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  )
}