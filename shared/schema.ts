import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const calendars = pgTable("calendars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#3b82f6"),
  userId: varchar("user_id").notNull().references(() => users.id),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  calendarId: varchar("calendar_id").notNull().references(() => calendars.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  category: text("category"), // 'work', 'exercise', 'social', 'rest', 'other'
  confidence: text("confidence"), // 'high', 'medium', 'low'
  isAllDay: text("is_all_day").notNull().default("false"),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertCalendarSchema = createInsertSchema(calendars).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCalendar = z.infer<typeof insertCalendarSchema>;
export type Calendar = typeof calendars.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
