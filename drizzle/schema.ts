import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Test Results table - stores all test attempts by users
 */
export const testResults = mysqlTable("testResults", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["block", "general"]).notNull(),
  blockId: varchar("blockId", { length: 10 }),
  blockName: varchar("blockName", { length: 255 }),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  percentage: int("percentage").notNull(),
  duration: int("duration").notNull(), // in seconds
  userAnswers: text("userAnswers").notNull(), // JSON string
  questions: text("questions").notNull(), // JSON string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = typeof testResults.$inferInsert;

/**
 * Sync Log table - tracks synchronization between devices
 */
export const syncLog = mysqlTable("syncLog", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 255 }).notNull(),
  action: mysqlEnum("action", ["upload", "download", "sync"]).notNull(),
  entityType: mysqlEnum("entityType", ["testResult", "userStats"]).notNull(),
  entityId: varchar("entityId", { length: 36 }),
  status: mysqlEnum("status", ["pending", "success", "failed"]).default("pending").notNull(),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SyncLog = typeof syncLog.$inferSelect;
export type InsertSyncLog = typeof syncLog.$inferInsert;

/**
 * User Stats table - aggregated statistics per user
 */
export const userStats = mysqlTable("userStats", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: int("userId").notNull().unique(),
  totalTests: int("totalTests").default(0).notNull(),
  totalCorrect: int("totalCorrect").default(0).notNull(),
  averagePercentage: int("averagePercentage").default(0).notNull(),
  lastTestAt: timestamp("lastTestAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;
