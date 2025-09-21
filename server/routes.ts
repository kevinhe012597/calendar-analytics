import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { z } from "zod";
import type { User } from "@shared/schema";

// Session type augmentation  
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Helper function to categorize events using basic keywords
  function categorizeEvent(title: string, description?: string): {
    category: 'work' | 'exercise' | 'social' | 'rest' | 'other';
    confidence: 'high' | 'medium' | 'low';
  } {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    // Work keywords
    if (text.match(/(meeting|standup|call|work|office|client|project|review|interview|conference|presentation)/)) {
      return { category: 'work', confidence: 'medium' };
    }
    
    // Exercise keywords  
    if (text.match(/(gym|workout|exercise|run|yoga|fitness|sport|training|cycling|swimming)/)) {
      return { category: 'exercise', confidence: 'medium' };
    }
    
    // Social keywords
    if (text.match(/(dinner|lunch|coffee|party|social|friends|family|birthday|wedding|date)/)) {
      return { category: 'social', confidence: 'medium' };
    }
    
    // Rest keywords
    if (text.match(/(break|rest|sleep|relax|vacation|holiday|personal|medical|doctor|appointment)/)) {
      return { category: 'rest', confidence: 'medium' };
    }
    
    return { category: 'other', confidence: 'low' };
  }

  // Global demo user for consistent demo experience
  let globalDemoUser: User | null = null;

  // Helper function to get or create demo user
  async function getDemoUser(req: any): Promise<User> {
    // For demo purposes, always use the same global demo user
    if (!globalDemoUser) {
      const demoUsername = 'demo@example.com';
      
      // Try to find existing demo user first
      let demoUser = await storage.getUserByUsername(demoUsername);
      
      if (!demoUser) {
        // Create demo user if it doesn't exist
        demoUser = await storage.createUser({
          username: demoUsername,
          password: 'demo_user'
        });
        console.log('Created global demo user:', demoUser.id);
      }
      
      globalDemoUser = demoUser;
    }
    
    // Store user ID in session
    req.session.userId = globalDemoUser.id;
    return globalDemoUser;
  }

  // Get user calendars
  app.get('/api/calendars', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      console.log('GET /api/calendars - Using user ID:', user.id);
      const calendars = await storage.getUserCalendars(user.id);
      console.log('GET /api/calendars - Found calendars:', calendars.length);
      res.json(calendars);
    } catch (error) {
      console.error('Failed to get calendars:', error);
      res.status(500).json({ error: 'Failed to get calendars' });
    }
  });

  // Create new calendar
  app.post('/api/calendars', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      console.log('POST /api/calendars - Using user ID:', user.id);
      const { name, description, color } = req.body;
      
      if (!name?.trim()) {
        return res.status(400).json({ error: 'Calendar name is required' });
      }

      const calendar = await storage.createCalendar({
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#3b82f6',
        userId: user.id
      });

      console.log('POST /api/calendars - Created calendar:', calendar.id, 'for user:', calendar.userId);
      res.status(201).json(calendar);
    } catch (error) {
      console.error('Failed to create calendar:', error);
      res.status(500).json({ error: 'Failed to create calendar' });
    }
  });

  // Update calendar
  app.put('/api/calendars/:id', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const { id } = req.params;
      const { name, description, color } = req.body;
      
      // Verify calendar belongs to user
      const calendar = await storage.getCalendar(id);
      if (!calendar || calendar.userId !== user.id) {
        return res.status(404).json({ error: 'Calendar not found' });
      }

      const updatedCalendar = await storage.updateCalendar(id, {
        name: name?.trim(),
        description: description?.trim() || null,
        color: color
      });

      res.json(updatedCalendar);
    } catch (error) {
      console.error('Failed to update calendar:', error);
      res.status(500).json({ error: 'Failed to update calendar' });
    }
  });

  // Delete calendar
  app.delete('/api/calendars/:id', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const { id } = req.params;
      
      // Verify calendar belongs to user
      const calendar = await storage.getCalendar(id);
      if (!calendar || calendar.userId !== user.id) {
        return res.status(404).json({ error: 'Calendar not found' });
      }

      await storage.deleteCalendar(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Failed to delete calendar:', error);
      res.status(500).json({ error: 'Failed to delete calendar' });
    }
  });

  // Get events for a calendar
  app.get('/api/calendars/:id/events', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      
      // Verify calendar belongs to user
      const calendar = await storage.getCalendar(id);
      if (!calendar || calendar.userId !== user.id) {
        return res.status(404).json({ error: 'Calendar not found' });
      }

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const events = await storage.getCalendarEvents(id, start, end);
      res.json(events);
    } catch (error) {
      console.error('Failed to get events:', error);
      res.status(500).json({ error: 'Failed to get events' });
    }
  });

  // Create new event
  app.post('/api/events', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const { calendarId, title, description, startTime, endTime, location, isAllDay } = req.body;
      
      if (!calendarId || !title?.trim() || !startTime || !endTime) {
        return res.status(400).json({ error: 'Calendar ID, title, start time, and end time are required' });
      }

      // Verify calendar belongs to user
      const calendar = await storage.getCalendar(calendarId);
      if (!calendar || calendar.userId !== user.id) {
        return res.status(404).json({ error: 'Calendar not found' });
      }

      // Auto-categorize the event
      const { category, confidence } = categorizeEvent(title, description);

      const event = await storage.createCalendarEvent({
        calendarId,
        title: title.trim(),
        description: description?.trim() || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        category,
        confidence,
        location: location?.trim() || null,
        isAllDay: isAllDay ? 'true' : 'false'
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Failed to create event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  // Update event
  app.put('/api/events/:id', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const { id } = req.params;
      const { title, description, startTime, endTime, location, isAllDay, category } = req.body;
      
      // Get event and verify user owns it
      const event = await storage.getCalendarEventById(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const calendar = await storage.getCalendar(event.calendarId);
      if (!calendar || calendar.userId !== user.id) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Re-categorize if title or description changed
      let updatedCategory = category;
      let updatedConfidence = event.confidence;
      if ((title && title !== event.title) || (description !== event.description)) {
        const categorization = categorizeEvent(title || event.title, description);
        updatedCategory = categorization.category;
        updatedConfidence = categorization.confidence;
      }

      const updatedEvent = await storage.updateCalendarEvent(id, {
        title: title?.trim(),
        description: description?.trim() || null,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        location: location?.trim() || null,
        isAllDay: isAllDay !== undefined ? (isAllDay ? 'true' : 'false') : undefined,
        category: updatedCategory,
        confidence: updatedConfidence
      });

      res.json(updatedEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  });

  // Delete event
  app.delete('/api/events/:id', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const { id } = req.params;
      
      // Get event and verify user owns it
      const event = await storage.getCalendarEventById(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const calendar = await storage.getCalendar(event.calendarId);
      if (!calendar || calendar.userId !== user.id) {
        return res.status(404).json({ error: 'Event not found' });
      }

      await storage.deleteCalendarEvent(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Failed to delete event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

  // Get all events for user (for analytics)
  app.get('/api/events', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const events = await storage.getUserCalendarEvents(user.id, start, end);
      res.json(events);
    } catch (error) {
      console.error('Failed to get user events:', error);
      res.status(500).json({ error: 'Failed to get events' });
    }
  });

  // Analytics endpoint
  app.get('/api/analytics', async (req, res) => {
    try {
      const user = await getDemoUser(req);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const events = await storage.getUserCalendarEvents(user.id, weekAgo);

      // Calculate time allocation by category
      const categoryTotals: Record<string, number> = {};
      const dailyTotals: Record<string, Record<string, number>> = {};
      
      const colors = {
        work: '#3b82f6',
        exercise: '#10b981', 
        social: '#8b5cf6',
        rest: '#06b6d4',
        other: '#f59e0b'
      };

      events.forEach(event => {
        const category = event.category || 'other';
        const duration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60); // hours
        const day = new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'short' });

        // Category totals
        categoryTotals[category] = (categoryTotals[category] || 0) + duration;

        // Daily totals
        if (!dailyTotals[day]) dailyTotals[day] = {};
        dailyTotals[day][category] = (dailyTotals[day][category] || 0) + duration;
      });

      // Format time allocation data
      const timeAllocation = Object.entries(categoryTotals).map(([category, hours]) => ({
        category,
        hours: Math.round(hours * 10) / 10,
        color: colors[category as keyof typeof colors] || colors.other
      }));

      // Format trend data
      const trends = Object.entries(dailyTotals).map(([date, categories]) => ({
        date,
        ...categories
      }));

      // Calculate metrics
      const totalHours = Object.values(categoryTotals).reduce((sum, hours) => sum + hours, 0);
      const mostProductiveDay = Object.entries(dailyTotals)
        .map(([day, categories]) => ({
          day,
          total: Object.values(categories).reduce((sum, hours) => sum + hours, 0)
        }))
        .sort((a, b) => b.total - a.total)[0]?.day || 'N/A';

      res.json({
        timeAllocation,
        trends,
        metrics: {
          totalHours: Math.round(totalHours * 10) / 10,
          eventsCount: events.length,
          mostProductiveDay
        }
      });
    } catch (error) {
      console.error('Failed to get analytics:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}