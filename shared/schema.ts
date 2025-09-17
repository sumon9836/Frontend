import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// WhatsApp Sessions
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: varchar("phone_number").notNull().unique(),
  status: varchar("status").notNull().default("disconnected"), // connected, disconnected, pairing
  pairingCode: varchar("pairing_code"),
  lastSeen: timestamp("last_seen"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blocked Users
export const blockedUsers = pgTable("blocked_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: varchar("phone_number").notNull().unique(),
  blockedAt: timestamp("blocked_at").defaultNow(),
  reason: text("reason"),
});

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  phoneNumber: true,
});

export const insertBlockedUserSchema = createInsertSchema(blockedUsers).pick({
  phoneNumber: true,
  reason: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  password: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertBlockedUser = z.infer<typeof insertBlockedUserSchema>;
export type BlockedUser = typeof blockedUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// API Response Types
export type PairResponse = {
  number: string;
  code?: string;
  status?: string;
  error?: string;
};

export type SessionStatus = {
  connected: boolean;
  user: string;
};

export type SessionsResponse = {
  active: string[];
  status: Record<string, SessionStatus>;
};

export type ApiResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};
