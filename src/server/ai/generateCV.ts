import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { api } from "~/trpc/server";
import { formatWorkExperience } from "../work-experience/helpers";

export async function generateCV(jobApplicationId: string) {
  console.log("start generating CV");
  const relevantExperiences =
    await api.workExperience.getForJobApplication(jobApplicationId);

  const userInfo = await api.user.me();
  const jobDescription = await api.jobApplication.get(jobApplicationId);

  const formattedExperiences = relevantExperiences
    .map((experience) => {
      return formatWorkExperience(experience);
    })
    .join("\n");

  const formattedJobDetails = `
  Job Title: ${jobDescription.jobTitle}
  Company: ${jobDescription.companyName}
  Description:
${jobDescription.jobDescription}
  `.trim();

  const formattedUserDetails = `
  Name: ${userInfo.given_name} ${userInfo.family_name}
  Email: ${userInfo.email}
  `.trim();

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content:
          "Use the following information to generate a CV, including relevant experiences and personal details. Generate the document in Markdown format, include only the markdown code in your answer",
      },
      {
        role: "system",
        content: formattedUserDetails,
      },
      {
        role: "system",
        content: formattedExperiences,
      },
      {
        role: "system",
        content: formattedJobDetails,
      },
    ],
  });

  return text;
}
