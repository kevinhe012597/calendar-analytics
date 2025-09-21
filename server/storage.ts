import { type User, type InsertUser, type Calendar, type InsertCalendar, type CalendarEvent, type InsertCalendarEvent } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Calendars
  createCalendar(calendar: InsertCalendar): Promise<Calendar>;
  getUserCalendars(userId: string): Promise<Calendar[]>;
  getCalendar(id: string): Promise<Calendar | undefined>;
  updateCalendar(id: string, updates: Partial<Calendar>): Promise<Calendar | undefined>;
  deleteCalendar(id: string): Promise<boolean>;
  
  // Calendar events
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  getCalendarEvents(calendarId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]>;
  getUserCalendarEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]>;
  updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteCalendarEvent(id: string): Promise<boolean>;
  upsertCalendarEvent(event: InsertCalendarEvent & { id: string }): Promise<CalendarEvent>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private calendars: Map<string, Calendar>;
  private calendarEvents: Map<string, CalendarEvent>;

  constructor() {
    this.users = new Map();
    this.calendars = new Map();
    this.calendarEvents = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Calendar methods
  async createCalendar(insertCalendar: InsertCalendar): Promise<Calendar> {
    const id = randomUUID();
    const now = new Date();
    const calendar: Calendar = {
      ...insertCalendar,
      id,
      isActive: 'true',
      createdAt: now,
      updatedAt: now,
    };
    this.calendars.set(id, calendar);
    return calendar;
  }

  async getUserCalendars(userId: string): Promise<Calendar[]> {
    return Array.from(this.calendars.values()).filter(
      (calendar) => calendar.userId === userId && calendar.isActive === 'true'
    );
  }

  async getCalendar(id: string): Promise<Calendar | undefined> {
    return this.calendars.get(id);
  }

  async updateCalendar(id: string, updates: Partial<Calendar>): Promise<Calendar | undefined> {
    const calendar = this.calendars.get(id);
    if (!calendar) return undefined;

    const updatedCalendar: Calendar = {
      ...calendar,
      ...updates,
      updatedAt: new Date(),
    };
    this.calendars.set(id, updatedCalendar);
    return updatedCalendar;
  }

  async deleteCalendar(id: string): Promise<boolean> {
    return this.calendars.delete(id);
  }

  // Calendar event methods
  async createCalendarEvent(insertEvent: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = randomUUID();
    const now = new Date();
    const event: CalendarEvent = {
      ...insertEvent,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.calendarEvents.set(id, event);
    return event;
  }

  async getCalendarEvents(calendarId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    let events = Array.from(this.calendarEvents.values()).filter(
      (event) => event.calendarId === calendarId
    );

    if (startDate) {
      events = events.filter(event => new Date(event.startTime) >= startDate);
    }
    if (endDate) {
      events = events.filter(event => new Date(event.endTime) <= endDate);
    }

    return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getUserCalendarEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    // Get all user calendars first
    const userCalendars = await this.getUserCalendars(userId);
    const calendarIds = userCalendars.map(cal => cal.id);

    let events = Array.from(this.calendarEvents.values()).filter(
      (event) => calendarIds.includes(event.calendarId)
    );

    if (startDate) {
      events = events.filter(event => new Date(event.startTime) >= startDate);
    }
    if (endDate) {
      events = events.filter(event => new Date(event.endTime) <= endDate);
    }

    return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getCalendarEventById(id: string): Promise<CalendarEvent | undefined> {
    return this.calendarEvents.get(id);
  }

  async updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | undefined> {
    const event = this.calendarEvents.get(id);
    if (!event) return undefined;

    const updatedEvent: CalendarEvent = {
      ...event,
      ...updates,
      updatedAt: new Date(),
    };
    this.calendarEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteCalendarEvent(id: string): Promise<boolean> {
    return this.calendarEvents.delete(id);
  }

  async upsertCalendarEvent(eventWithId: InsertCalendarEvent & { id: string }): Promise<CalendarEvent> {
    const existingEvent = this.calendarEvents.get(eventWithId.id);
    const now = new Date();

    if (existingEvent) {
      const updatedEvent: CalendarEvent = {
        ...existingEvent,
        ...eventWithId,
        updatedAt: now,
      };
      this.calendarEvents.set(eventWithId.id, updatedEvent);
      return updatedEvent;
    } else {
      const newEvent: CalendarEvent = {
        ...eventWithId,
        createdAt: now,
        updatedAt: now,
      };
      this.calendarEvents.set(eventWithId.id, newEvent);
      return newEvent;
    }
  }
}

export const storage: IStorage = new MemStorage();