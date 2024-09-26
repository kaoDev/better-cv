import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { generateEmbedding } from "~/server/ai/embeddings";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createInsertWorkExperience,
  createWorkExperienceClientModel,
} from "~/server/work-experience/helpers";
import { workExperienceClientFormSchema } from "~/server/work-experience/types";
import { jobApplications, workExperiences } from "../../db/schema";

export const workExperienceRouter = createTRPCRouter({
  // add new work experience
  add: protectedProcedure
    .input(workExperienceClientFormSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const newExperience = await createInsertWorkExperience(input, userId);

      const result = await ctx.db
        .insert(workExperiences)
        .values(newExperience)
        .returning();

      const newEntry = result[0];

      if (!newEntry) {
        throw new Error("Failed to insert work experience");
      }

      return createWorkExperienceClientModel(newEntry);
    }),

  addMany: protectedProcedure
    .input(z.array(workExperienceClientFormSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const newExperiences = await Promise.all(
        input.map((experience) =>
          createInsertWorkExperience(experience, userId),
        ),
      );

      const result = await ctx.db
        .insert(workExperiences)
        .values(newExperiences)
        .returning();

      return result.map(createWorkExperienceClientModel);
    }),

  // Get all work experiences
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const experiences = await ctx.db
      .select()
      .from(workExperiences)
      .where(eq(workExperiences.userId, userId))
      .execute();

    return experiences.map(createWorkExperienceClientModel);
  }),

  // Update work experience
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: workExperienceClientFormSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, data } = input;

      const updatedExperience = await createInsertWorkExperience(data, userId);

      const result = await ctx.db
        .update(workExperiences)
        .set(updatedExperience)
        .where(
          and(eq(workExperiences.id, id), eq(workExperiences.userId, userId)),
        )
        .returning();

      const updatedEntry = result[0];

      if (!updatedEntry) {
        throw new Error("Failed to update work experience");
      }

      return createWorkExperienceClientModel(updatedEntry);
    }),

  // Delete work experience
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const result = await ctx.db
        .delete(workExperiences)
        .where(
          and(
            eq(workExperiences.id, input),
            eq(workExperiences.userId, userId),
          ),
        )
        .returning();

      const deletedEntry = result[0];

      if (!deletedEntry) {
        throw new Error("Failed to delete work experience");
      }

      return createWorkExperienceClientModel(deletedEntry);
    }),

  // Get work experience by ID
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const result = await ctx.db
      .select()
      .from(workExperiences)
      .where(
        and(eq(workExperiences.id, input), eq(workExperiences.userId, userId)),
      )
      .execute();

    const experience = result[0];

    if (!experience) {
      throw new Error("Work experience not found");
    }

    return createWorkExperienceClientModel(experience);
  }),

  // Get work experiences relevant to a job application
  getForJobApplication: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const applicationResult = await ctx.db
        .select()
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.id, input),
            eq(jobApplications.userId, userId),
          ),
        )
        .execute();

      const application = applicationResult[0];

      if (!application) {
        throw new Error("Job application not found");
      }

      const jobDescriptionEmbedding = await generateEmbedding(
        application.jobDescription,
      );

      const similarity = sql<number>`1 - (${cosineDistance(workExperiences.embedding, jobDescriptionEmbedding)})`;

      const result = await ctx.db
        .select({
          title: workExperiences.title,
          description: workExperiences.description,
          company: workExperiences.company,
          startDate: workExperiences.startDate,
          endDate: workExperiences.endDate,
          bulletPoints: workExperiences.bulletPoints,
          skills: workExperiences.skills,
          location: workExperiences.location,
          similarity,
        })
        .from(workExperiences)
        .where(and(eq(workExperiences.userId, userId), gt(similarity, 0.3)))
        .orderBy((t) => desc(t.similarity))
        .execute();

      return result;
    }),
});
