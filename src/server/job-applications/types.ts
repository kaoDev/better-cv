import { z } from "zod";

export const applicationStatusOptions = [
  "draft",
  "applied",
  "interviewing",
  "offered",
  "rejected",
] as const;

export const creationSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string(),
  notes: z.string().optional(),
  applicationStatus: z.enum(applicationStatusOptions).optional(),
  appliedDate: z.string().optional(),
});

export type JobApplicationDTO = z.infer<typeof creationSchema>;

export const updateSchema = z.object({
  id: z.string(),
  data: creationSchema,
});
