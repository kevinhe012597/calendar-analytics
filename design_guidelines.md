# AI Calendar Tracker - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from productivity tools like Notion and Linear, combined with data visualization patterns from Apple Health and Oura Ring. This approach balances professional utility with engaging visual analytics.

## Core Design Elements

### A. Color Palette
**Primary Colors (Dark Mode Default):**
- Background: 220 15% 8% (deep navy-black)
- Surface: 220 12% 12% (elevated dark surface)
- Primary Brand: 210 85% 55% (vibrant blue for calendar events)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 220 10% 65% (muted gray)

**Accent Colors:**
- Success/Exercise: 142 76% 36% (emerald green)
- Work Category: 210 85% 55% (primary blue)
- Social Category: 280 60% 60% (soft purple)
- Rest Category: 190 50% 50% (calming teal)

### B. Typography
**Font Stack:** Inter via Google Fonts CDN
- Headers: Inter 600 (Semi-bold)
- Body Text: Inter 400 (Regular)  
- Data/Metrics: Inter 500 (Medium)
- Captions: Inter 400 (Regular, smaller size)

### C. Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8)
- Micro spacing: 2 units (8px)
- Standard spacing: 4 units (16px)
- Section spacing: 6 units (24px)
- Major spacing: 8 units (32px)

### D. Component Library

**Navigation:**
- Clean sidebar with minimal icons
- Subtle active state indicators
- Collapsible for mobile

**Analytics Cards:**
- Rounded corners (rounded-lg)
- Subtle shadow with colored left border indicating category
- White/dark surface with good contrast

**Charts & Visualizations:**
- Donut charts for time allocation
- Bar charts for weekly/monthly trends
- Consistent color mapping across all visualizations
- Subtle grid lines and axis labels

**Calendar Components:**
- Clean event blocks with category color coding
- Minimal borders and generous padding
- Clear time labels and duration indicators

**Data Display:**
- Metric cards with large numbers and descriptive labels
- Progress bars for goal tracking
- Trend indicators (up/down arrows)

### E. Animations
Minimal and purposeful:
- Subtle hover states on interactive elements
- Smooth transitions for chart updates (300ms ease)
- Loading states for data fetching

## Key Design Principles

1. **Data-First Design**: Information hierarchy prioritizes insights and patterns
2. **Category Color Consistency**: Maintain color mapping across all components
3. **Breathing Room**: Generous whitespace for clarity and focus
4. **Progressive Disclosure**: Show overview first, details on interaction
5. **Mobile-Responsive**: Charts and analytics adapt gracefully to smaller screens

## Images
No large hero image needed. Focus on:
- Placeholder charts and graphs for empty states
- Simple iconography for categories (work, exercise, social, rest)
- Calendar visualization mockups showing real event data
- Small avatar placeholder for user profile

The design emphasizes clean data presentation over decorative imagery, maintaining focus on analytics and insights.