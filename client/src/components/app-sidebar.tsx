import { Calendar, BarChart3, PieChart, TrendingUp, Brain, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Calendar View",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Time Analytics",
    url: "/analytics",
    icon: PieChart,
  },
  {
    title: "Trends",
    url: "/trends", 
    icon: TrendingUp,
  },
  {
    title: "AI Insights",
    url: "/insights",
    icon: Brain,
  },
]

const settingsItems = [
  {
    title: "Categories",
    url: "/categories",
    icon: Settings,
  },
  {
    title: "Integrations",
    url: "/integrations", 
    icon: Settings,
  },
]

export function AppSidebar() {
  // todo: remove mock active state functionality
  const handleNavClick = (item: any) => {
    console.log(`Navigating to ${item.title}`)
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => handleNavClick(item)}
                      data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                      className="w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => handleNavClick(item)}
                      data-testid={`nav-${item.title.toLowerCase()}`}
                      className="w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}