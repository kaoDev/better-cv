import "server-only";

import type { Doc, DocInsert } from "~/server/db/types";
import { generateEmbedding } from "../ai/embeddings";
import type {
  WorkExperienceClientFormModel,
  WorkExperienceClientModel,
} from "./types";

export function formatWorkExperience(
  workExperience: WorkExperienceClientFormModel,
): string {
  const {
    title,
    description,
    bulletPoints,
    skills,
    startDate,
    endDate,
    company,
    location,
  } = workExperience;

  // Join bullet points and skills into comma-separated strings
  const bulletPointsText = bulletPoints.join(", ");
  const skillsText = skills.join(", ");

  // Combine all parts into a single formatted string
  const formattedText = `
    ${title} at ${company} (${location})
    ${startDate} - ${endDate}
    ${description}
    Key Responsibilities: ${bulletPointsText}
    Skills: ${skillsText}
  `.trim(); // Trim to remove any extra spaces or newlines

  return formattedText;
}

export async function createInsertWorkExperience(
  data: WorkExperienceClientFormModel,
  userId: string,
): Promise<DocInsert<"workExperiences">> {
  const formattedText = formatWorkExperience(data);

  const embedding = await generateEmbedding(formattedText);

  return {
    ...data,
    userId,
    embedding,
  };
}

export function createWorkExperienceClientModel({
  embedding,
  ...workExperience
}: Doc<"workExperiences">): WorkExperienceClientModel {
  const formatted = formatWorkExperience(workExperience);

  return {
    ...workExperience,
    formattedContent: formatted,
  };
}
