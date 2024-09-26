import { z } from "zod";

export const workExperienceClientFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  bulletPoints: z.array(z.string()),
  skills: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
  company: z.string(),
  location: z.string(),
});

export type WorkExperienceClientFormModel = z.infer<
  typeof workExperienceClientFormSchema
>;

export interface WorkExperienceClientModel
  extends WorkExperienceClientFormModel {
  id: string;
  formattedContent: string;
}
