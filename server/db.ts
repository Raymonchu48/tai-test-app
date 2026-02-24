import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

import { and, desc } from "drizzle-orm";
import {
  testResults,
  userStats,
  syncLog,
  InsertTestResult,
  InsertUserStats,
  InsertSyncLog,
  TestResult,
  UserStats,
} from "../drizzle/schema";

/**
 * Test Results Functions
 */

export async function createTestResult(data: InsertTestResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(testResults).values(data);

  // Update user stats
  await updateUserStats(data.userId);

  return data.id;
}

export async function getUserTestResults(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(testResults)
    .where(eq(testResults.userId, userId))
    .orderBy(desc(testResults.createdAt));
}

export async function getTestResultById(id: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(testResults)
    .where(eq(testResults.id, id));

  return result[0] || null;
}

export async function getBlockTestResults(userId: number, blockId: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(testResults)
    .where(
      and(
        eq(testResults.userId, userId),
        eq(testResults.blockId, blockId)
      )
    )
    .orderBy(desc(testResults.createdAt));
}

/**
 * User Stats Functions
 */

export async function getUserStatsFromDb(userId: number): Promise<UserStats | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));

  return result[0] || null;
}

export async function createUserStats(data: InsertUserStats) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userStats).values(data);
  return data.id;
}

export async function updateUserStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get all test results for the user
  const results = await db
    .select()
    .from(testResults)
    .where(eq(testResults.userId, userId));

  if (results.length === 0) return;

  // Calculate statistics
  const totalTests = results.length;
  const totalCorrect = results.reduce((sum, r) => sum + r.score, 0);
  const averagePercentage =
    results.reduce((sum, r) => sum + r.percentage, 0) / totalTests;
  const lastTestAt = results[0]?.createdAt;

  // Check if stats exist
  const existingStats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));

  if (existingStats.length > 0) {
    // Update existing stats
    await db
      .update(userStats)
      .set({
        totalTests,
        totalCorrect,
        averagePercentage: Math.round(averagePercentage),
        lastTestAt,
      })
      .where(eq(userStats.userId, userId));
  } else {
    // Create new stats
    const id = `stats-${userId}-${Date.now()}`;
    await db.insert(userStats).values({
      id,
      userId,
      totalTests,
      totalCorrect,
      averagePercentage: Math.round(averagePercentage),
      lastTestAt,
    });
  }
}

/**
 * Sync Log Functions
 */

export async function createSyncLog(data: InsertSyncLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(syncLog).values(data);
  return data.id;
}

export async function updateSyncLogStatus(
  id: string,
  status: "pending" | "success" | "failed",
  lastSyncedAt?: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(syncLog)
    .set({
      status,
      lastSyncedAt: lastSyncedAt || new Date(),
    })
    .where(eq(syncLog.id, id));
}

export async function getUserSyncLog(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(syncLog)
    .where(eq(syncLog.userId, userId))
    .orderBy(desc(syncLog.createdAt));
}

export async function getLastSyncTime(userId: number, deviceId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(syncLog)
    .where(
      and(
        eq(syncLog.userId, userId),
        eq(syncLog.deviceId, deviceId)
      )
    )
    .orderBy(desc(syncLog.createdAt));

  return result[0]?.lastSyncedAt || null;
}
