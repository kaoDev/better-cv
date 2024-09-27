import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Doc } from "~/server/db/types";
import {
  contactDetailSchema,
  educationSchema,
  languageSchema,
  referenceSchema,
} from "~/server/personal-details/helpers";
import {
  contactDetails,
  educations,
  languages,
  references,
  users,
} from "../../db/schema";

export const userRouter = createTRPCRouter({
  // Get user by ID
  me: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const result = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    const user = result[0];

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),

  // Update an user
  update: protectedProcedure
    .input(
      z.object({
        givenName: z.string().min(1).optional(),
        familyName: z.string().min(1).optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { givenName, familyName, image } = input;

      const updatedFields: Partial<Doc<"users">> = {};
      if (givenName !== undefined) {
        updatedFields.givenName = givenName;
      }
      if (familyName !== undefined) {
        updatedFields.familyName = familyName;
      }
      if (image !== undefined) {
        updatedFields.image = image;
      }

      const query = ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, userId))
        .toSQL();

      console.log("Updating user:", {
        updatedFields,
        userId,
        query,
      });

      const updatedUser = await ctx.db
        .update(users)
        .set(updatedFields)
        .where(eq(users.id, userId))
        .returning();

      return updatedUser;
    }),

  // Add a contact detail
  addContactDetail: protectedProcedure
    .input(contactDetailSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { type, value } = input;

      const contactDetail = await ctx.db
        .insert(contactDetails)
        .values({
          userId,
          type,
          value,
        })
        .returning();

      return contactDetail;
    }),

  // Delete a contact detail
  deleteContactDetail: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const contactDetailId = input;

      const contactDetail = await ctx.db
        .delete(contactDetails)
        .where(
          and(
            eq(contactDetails.userId, userId),
            eq(contactDetails.id, contactDetailId),
          ),
        )
        .returning();

      return contactDetail;
    }),

  // Update a contact detail
  updateContactDetail: protectedProcedure
    .input(z.object({ id: z.string(), data: contactDetailSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, data } = input;

      const contactDetail = await ctx.db
        .update(contactDetails)
        .set({ ...data })
        .where(
          and(eq(contactDetails.userId, userId), eq(contactDetails.id, id)),
        )
        .returning();

      return contactDetail;
    }),

  // Get all contact details
  getContactDetails: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userContactDetails = await ctx.db
      .select()
      .from(contactDetails)
      .where(eq(contactDetails.userId, userId))
      .execute();

    return userContactDetails;
  }),

  // Add multiple contact details
  addContactDetails: protectedProcedure
    .input(z.array(contactDetailSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const newContactDetails = await ctx.db
        .insert(contactDetails)
        .values(input.map((contactDetail) => ({ ...contactDetail, userId })))
        .returning();

      return newContactDetails;
    }),

  // Add education
  addEducation: protectedProcedure
    .input(educationSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { institute, title, timeFrame } = input;

      const education = await ctx.db
        .insert(educations)
        .values({
          userId,
          institute,
          title,
          timeFrame,
        })
        .returning();

      return education;
    }),

  // Delete education
  deleteEducation: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const educationId = input;

      const education = await ctx.db
        .delete(educations)
        .where(
          and(eq(educations.userId, userId), eq(educations.id, educationId)),
        )
        .returning();

      return education;
    }),

  // Update education
  updateEducation: protectedProcedure
    .input(z.object({ id: z.string(), data: educationSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, data } = input;

      const education = await ctx.db
        .update(educations)
        .set(data)
        .where(and(eq(educations.userId, userId), eq(educations.id, id)))
        .returning();

      return education;
    }),

  // Get all educations
  getEducations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userEducations = await ctx.db
      .select()
      .from(educations)
      .where(eq(educations.userId, userId))
      .execute();

    return userEducations;
  }),

  // Add multiple educations
  addEducations: protectedProcedure
    .input(z.array(educationSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const newEducations = await ctx.db
        .insert(educations)
        .values(input.map((education) => ({ ...education, userId })))
        .returning();

      return newEducations;
    }),

  // Add language
  addLanguage: protectedProcedure
    .input(languageSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { name, proficiency } = input;

      const language = await ctx.db
        .insert(languages)
        .values({
          userId,
          name,
          proficiency,
        })
        .returning();

      return language;
    }),

  // Delete language
  deleteLanguage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const languageId = input;

      const language = await ctx.db
        .delete(languages)
        .where(and(eq(languages.userId, userId), eq(languages.id, languageId)))
        .returning();

      return language;
    }),

  // Update language
  updateLanguage: protectedProcedure
    .input(z.object({ id: z.string(), data: languageSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, data } = input;

      const language = await ctx.db
        .update(languages)
        .set(data)
        .where(and(eq(languages.userId, userId), eq(languages.id, id)))
        .returning();

      return language;
    }),

  // Get all languages
  getLanguages: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userLanguages = await ctx.db
      .select()
      .from(languages)
      .where(eq(languages.userId, userId))
      .execute();

    return userLanguages;
  }),

  // Add multiple languages
  addLanguages: protectedProcedure
    .input(z.array(languageSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const newLanguages = await ctx.db
        .insert(languages)
        .values(input.map((language) => ({ ...language, userId })))
        .returning();

      return newLanguages;
    }),

  // Add reference
  addReference: protectedProcedure
    .input(referenceSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { name, position, company, contact } = input;

      const reference = await ctx.db
        .insert(references)
        .values({
          userId,
          name,
          position,
          company,
          contact,
        })
        .returning();

      return reference;
    }),

  // Delete reference
  deleteReference: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const referenceId = input;

      const reference = await ctx.db
        .delete(references)
        .where(
          and(eq(references.userId, userId), eq(references.id, referenceId)),
        )
        .returning();

      return reference;
    }),

  // Update reference
  updateReference: protectedProcedure
    .input(z.object({ id: z.string(), data: referenceSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, data } = input;

      const reference = await ctx.db
        .update(references)
        .set(data)
        .where(and(eq(references.userId, userId), eq(references.id, id)))
        .returning();

      return reference;
    }),

  // Get all references
  getReferences: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userReferences = await ctx.db
      .select()
      .from(references)
      .where(eq(references.userId, userId))
      .execute();

    return userReferences;
  }),

  // Add multiple references
  addReferences: protectedProcedure
    .input(z.array(referenceSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const newReferences = await ctx.db
        .insert(references)
        .values(input.map((reference) => ({ ...reference, userId })))
        .returning();

      return newReferences;
    }),
});
