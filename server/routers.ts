import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

// Simple UUID generator (no external dependency)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tests: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserTestResults(ctx.user.id)
    ),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => db.getTestResultById(input.id)),

    getBlockResults: protectedProcedure
      .input(z.object({ blockId: z.string() }))
      .query(({ ctx, input }) =>
        db.getBlockTestResults(ctx.user.id, input.blockId)
      ),

    create: protectedProcedure
      .input(
        z.object({
          type: z.enum(["block", "general"]),
          blockId: z.string().optional(),
          blockName: z.string().optional(),
          score: z.number(),
          totalQuestions: z.number(),
          percentage: z.number(),
          duration: z.number(),
          userAnswers: z.record(z.string(), z.string()),
          questions: z.array(z.any()),
        })
      )
      .mutation(({ ctx, input }) => {
        const id = generateUUID();
        return db.createTestResult({
          id,
          userId: ctx.user.id,
          type: input.type,
          blockId: input.blockId,
          blockName: input.blockName,
          score: input.score,
          totalQuestions: input.totalQuestions,
          percentage: input.percentage,
          duration: input.duration,
          userAnswers: JSON.stringify(input.userAnswers),
          questions: JSON.stringify(input.questions),
        });
      }),
  }),

  stats: router({
    get: protectedProcedure.query(({ ctx }) =>
      db.getUserStatsFromDb(ctx.user.id)
    ),
  }),

  sync: router({
    getLog: protectedProcedure.query(({ ctx }) =>
      db.getUserSyncLog(ctx.user.id)
    ),

    getLastSyncTime: protectedProcedure
      .input(z.object({ deviceId: z.string() }))
      .query(({ ctx, input }) =>
        db.getLastSyncTime(ctx.user.id, input.deviceId)
      ),

    recordSync: protectedProcedure
      .input(
        z.object({
          deviceId: z.string(),
          action: z.enum(["upload", "download", "sync"]),
          entityType: z.enum(["testResult", "userStats"]),
          entityId: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const id = generateUUID();
        return db.createSyncLog({
          id,
          userId: ctx.user.id,
          deviceId: input.deviceId,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          status: "success",
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
