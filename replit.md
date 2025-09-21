# Overview

Calendar Insights is an AI-powered standalone calendar and time tracking analytics platform that allows users to create their own calendars, manage events, and receive detailed insights about time allocation and productivity patterns. The application features automatic event categorization and comprehensive analytics visualization, helping users understand their time usage patterns and optimize productivity through their own created calendar data.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom dark-mode focused design with Inter font, inspired by productivity tools like Notion and Linear

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express-session for user authentication state
- **API Design**: RESTful endpoints for calendar operations and data retrieval
- **Storage Abstraction**: Interface-based storage layer with in-memory implementation (IStorage interface)

## Data Storage
- **Storage**: In-memory storage with IStorage interface for development/demo
- **Schema**: Three main entities - users, calendars, and calendar events
- **ORM**: Drizzle ORM configured for future PostgreSQL integration
- **Current Implementation**: MemStorage class with Map-based data persistence

## Authentication & Authorization
- **Demo User System**: Simplified authentication using global demo user for MVP
- **Session-based Authentication**: Express-session for maintaining user state
- **Future Ready**: Architecture supports full user authentication system

## Event Categorization System
- **Keyword-Based Classification**: Deterministic event categorization using keyword matching
- **Categories**: work, exercise, social, rest, and other with intelligent keyword detection
- **Fallback Logic**: Comprehensive categorization without external API dependencies

## Data Processing Pipeline
- **Internal Calendar Management**: Full CRUD operations for user-created calendars
- **Event Management**: Complete event lifecycle management with real-time updates
- **Smart Categorization**: Automatic event classification based on title and description keywords
- **Analytics Generation**: Real-time time allocation charts, metrics, and productivity insights

## Component Architecture
- **Calendar Management**: CalendarManager component for creating, editing, and deleting calendars
- **Event Creation**: EventCreator component with form validation and automatic categorization
- **Analytics Dashboard**: Real-time metrics and charts that update as events are created
- **Responsive Design**: Mobile-first approach with intuitive user interface
- **Chart Visualization**: Recharts library for interactive time allocation and trend analysis

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm & drizzle-kit**: Type-safe ORM and database toolkit
- **googleapis**: Official Google APIs client library for Calendar integration
- **openai**: OpenAI API client for AI-powered event categorization

## Authentication & Security
- **google-auth-library**: Google OAuth 2.0 authentication
- **express-session**: Session management middleware
- **bcryptjs**: Password hashing for user accounts

## Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Headless UI components for accessibility
- **recharts**: Chart visualization library
- **wouter**: Lightweight React router
- **tailwindcss**: Utility-first CSS framework

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type-safe JavaScript
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development plugins

## Required Environment Variables
- `SESSION_SECRET`: Secret key for session encryption (provided)
- `OPENAI_API_KEY`: Available but not currently required (for future enhancements)

## Optional Environment Variables
- `DATABASE_URL`: For future PostgreSQL integration
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: For potential Google Calendar sync feature