import { z } from "zod";
import { contactDetailEnumValues } from "~/utils/enums";

export const contactDetailSchema = z.object({
  type: z.enum(contactDetailEnumValues),
  value: z.string(),
});

export const educationSchema = z.object({
  institute: z.string(),
  title: z.string(),
  timeFrame: z.string(),
});

export const languageSchema = z.object({
  name: z.string(),
  proficiency: z.string(),
});

export const referenceSchema = z.object({
  name: z.string(),
  position: z.string(),
  company: z.string(),
  contact: z.string(),
});
