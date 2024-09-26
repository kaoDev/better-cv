import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Doc } from "~/server/db/types";
import { users } from "../../db/schema";

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
        updatedFields.given_name = givenName;
      }
      if (familyName !== undefined) {
        updatedFields.family_name = familyName;
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
});
