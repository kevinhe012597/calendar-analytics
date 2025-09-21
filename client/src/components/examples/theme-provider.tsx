import { ThemeProvider } from "../theme-provider"
import { ThemeToggle } from "../theme-toggle"

export default function ThemeProviderExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="p-4 space-y-4 bg-background text-foreground min-h-32">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Theme Provider Example</h3>
          <ThemeToggle />
        </div>
        <p className="text-muted-foreground">Toggle between light and dark modes</p>
      </div>
    </ThemeProvider>
  )
}