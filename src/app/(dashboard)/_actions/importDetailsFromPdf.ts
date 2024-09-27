import { revalidatePath } from "next/cache";
import { parseInformationFromPDf } from "~/server/ai/parseWorkExperience";
import { api } from "~/trpc/server";

export async function importDetailsFromPdf(
  formData: FormData,
): Promise<string> {
  "use server";

  const file = formData.get("file") as File;

  if (!file) {
    return "Please select a file to upload.";
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const {
      workExperiences,
      contactDetails,
      educations,
      languages,
      references,
    } = await parseInformationFromPDf(fileBuffer);

    await Promise.all([
      api.workExperience.addMany(workExperiences),
      api.user.addContactDetails(contactDetails),
      api.user.addEducations(educations),
      api.user.addLanguages(languages),
      api.user.addReferences(references),
    ]);
  } catch (error) {
    console.error(error);
    return "Failed to upload and process the file. Please try again.";
  }

  revalidatePath("/work-experience");
  revalidatePath("/personal-info");

  return "Imported work experience from PDF.";
}
