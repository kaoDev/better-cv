import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { api } from "~/trpc/server";
import { formatWorkExperience } from "../work-experience/helpers";

export async function generateCV(jobApplicationId: string) {
  console.log("start generating CV");
  const relevantExperiences =
    await api.workExperience.getForJobApplication(jobApplicationId);

  const [
    userInfo,
    contactDetails,
    educations,
    languages,
    references,
    jobDescription,
  ] = await Promise.all([
    api.user.me(),
    api.user.getContactDetails(),
    api.user.getEducations(),
    api.user.getLanguages(),
    api.user.getReferences(),
    api.jobApplication.get(jobApplicationId),
  ]);

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
  Name: ${userInfo.givenName} ${userInfo.familyName}
  ${userInfo.image ? `Profile Picture: ${userInfo.image}` : ""}
  `.trim();

  const formattedContactDetails = `
    Contact Details:
    ${contactDetails.map((contactDetail) => {
      return `
      ${contactDetail.type}: ${contactDetail.value}
      `;
    })}
  `.trim();

  const formattedEducations = `
    Education:
    ${educations
      .map((education) => {
        return `
      ${education.institute}
      ${education.title}
      ${education.timeFrame}
      `.trim();
      })
      .join("\n")}
  `.trim();

  const formattedLanguages = `
    Languages:
    ${languages
      .map((language) => {
        return `
      ${language.name}
      ${language.proficiency}
      `.trim();
      })
      .join("\n")}
  `.trim();

  const formattedReferences = `
    References:
    ${references
      .map((reference) => {
        return `
      ${reference.name}
      ${reference.position}
      ${reference.company}
      ${reference.contact}
      `.trim();
      })
      .join("\n")}
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
        content: formattedContactDetails,
      },
      {
        role: "system",
        content: formattedEducations,
      },
      {
        role: "system",
        content: formattedLanguages,
      },
      {
        role: "system",
        content: formattedReferences,
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
