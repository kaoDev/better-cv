import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { creationSchema, updateSchema } from "~/server/job-applications/types";
import { jobApplications } from "../../db/schema";

export const jobApplicationRouter = createTRPCRouter({
  // add new job application
  add: protectedProcedure
    .input(creationSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const result = await ctx.db
        .insert(jobApplications)
        .values({
          userId,
          companyName: input.companyName,
          jobTitle: input.jobTitle,
          jobDescription: input.jobDescription,
          notes: input.notes,
          applicationStatus: input.applicationStatus,
          appliedDate: input.appliedDate,
        })
        .returning();

      const newEntry = result[0];

      if (!newEntry) {
        throw new Error("Failed to create job application");
      }

      return newEntry;
    }),

  // Get all job applications
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const applications = await ctx.db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.userId, userId))
      .execute();

    return applications;
  }),

  // Update job application
  update: protectedProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, data } = input;

      const result = await ctx.db
        .update(jobApplications)
        .set(data)
        .where(
          and(eq(jobApplications.id, id), eq(jobApplications.userId, userId)),
        )
        .returning();

      const updatedEntry = result[0];

      if (!updatedEntry) {
        throw new Error("Failed to update job application");
      }

      return updatedEntry;
    }),

  // Delete job application
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const result = await ctx.db
        .delete(jobApplications)
        .where(
          and(
            eq(jobApplications.id, input),
            eq(jobApplications.userId, userId),
          ),
        )
        .returning();

      const deletedEntry = result[0];

      if (!deletedEntry) {
        throw new Error("Failed to delete job application");
      }

      return deletedEntry;
    }),

  // Get job application by ID
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const result = await ctx.db
      .select()
      .from(jobApplications)
      .where(
        and(eq(jobApplications.id, input), eq(jobApplications.userId, userId)),
      )
      .execute();

    const application = result[0];

    if (!application) {
      throw new Error("job application not found");
    }

    return application;
  }),

  updateCV: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        markdown: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const result = await ctx.db
        .update(jobApplications)
        .set({ generatedCV: input.markdown })
        .where(
          and(
            eq(jobApplications.id, input.id),
            eq(jobApplications.userId, userId),
          ),
        )
        .returning();

      const updatedEntry = result[0];

      if (!updatedEntry) {
        throw new Error("Failed to update cv");
      }

      return updatedEntry;
    }),
});
