# Calendar Analytics

AI-powered Calendar Analytics application built with React, Node.js, and TypeScript.

## ✨ Features

- 📅 **Calendar Management**: Create and manage multiple calendars with custom colors and settings
- 🤖 **Smart Categorization**: Automatic event categorization using AI (work, exercise, social, rest, other)
- 📊 **Advanced Analytics**: 
  - Weekly time allocation pie charts
  - Daily breakdown visualizations  
  - Weekly activity histograms
  - Real-time metrics and insights
- 🎨 **Modern UI**: Clean, responsive interface built with Shadcn/ui components
- ⚡ **Real-time Updates**: Charts and analytics update instantly as you add events

## 🔧 Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for beautiful, accessible components
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **Recharts** for interactive data visualizations

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **In-memory storage** with extensible interface
- **RESTful API** design
- **Session-based authentication**

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5000`

## 📱 Usage

1. **Create a Calendar**: Click "New Calendar" to create your first calendar
2. **Add Events**: Use the "Add Event" button to create events with titles, descriptions, and time slots
3. **View Analytics**: Navigate to the dashboard to see your time allocation and activity patterns
4. **Smart Categorization**: Events are automatically categorized based on keywords in titles and descriptions

## 🎯 Event Categories

The app automatically categorizes your events:

- **Work**: meetings, calls, projects, reviews
- **Exercise**: gym, sports, running, fitness activities
- **Social**: dinners, parties, social gatherings
- **Rest**: breaks, relaxation, personal time
- **Other**: everything else

## 📈 Analytics Features

- **Weekly Pie Charts**: See your overall time allocation across categories
- **Daily Breakdowns**: Individual pie charts for each day with events
- **Weekly Histograms**: Stacked bar charts showing daily patterns
- **Real-time Metrics**: Total hours, most productive days, event counts

## 🛠️ Architecture

The application follows a clean architecture pattern:

- **Frontend**: React components with TypeScript
- **Backend**: Express.js REST API
- **Storage**: Interface-based storage (currently in-memory, easily extensible)
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom design system

## 📦 Project Structure

```
calendar-analytics/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/           # Utilities and configuration
├── server/                # Backend Express.js application
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data storage interface
│   └── google-calendar.ts # Event categorization logic
├── shared/                # Shared TypeScript definitions
└── scripts/              # Utility scripts
```

## 🔮 Future Enhancements

- [ ] PostgreSQL database integration
- [ ] Google Calendar sync
- [ ] AI-powered insights and recommendations
- [ ] Export functionality
- [ ] Mobile app
- [ ] Team collaboration features

Built with ❤️ using modern web technologies.