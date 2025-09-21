import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../app-sidebar"

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-96 w-full">
        <AppSidebar />
        <div className="flex-1 p-6 bg-background">
          <h3 className="text-lg font-semibold">Main Content Area</h3>
          <p className="text-muted-foreground mt-2">
            The sidebar provides navigation to different analytics views
          </p>
        </div>
      </div>
    </SidebarProvider>
  )
}