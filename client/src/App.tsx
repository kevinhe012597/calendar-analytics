import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dashboard } from "@/components/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      {/* Other routes will be added when backend is implemented */}
      <Route path="/calendar" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Calendar View</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
      <Route path="/analytics" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Time Analytics</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
      <Route path="/trends" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Trends</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
      <Route path="/insights" component={() => <div className="p-6"><h1 className="text-2xl font-bold">AI Insights</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
      <Route path="/categories" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Categories</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
      <Route path="/integrations" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Integrations</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  // Custom sidebar width for analytics dashboard
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="calendar-tracker-theme">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <div>
                      <h1 className="text-lg font-semibold">Calendar Insights</h1>
                      <p className="text-xs text-muted-foreground">AI-powered time analytics</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}