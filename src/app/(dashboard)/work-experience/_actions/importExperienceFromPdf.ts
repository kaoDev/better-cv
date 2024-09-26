import { revalidatePath } from "next/cache";
import { parseWorkExperience } from "~/server/ai/parseWorkExperience";
import { api } from "~/trpc/server";

export async function importExperienceFromPdf(
  formData: FormData,
): Promise<string> {
  "use server";

  const file = formData.get("file") as File;

  if (!file) {
    return "Please select a file to upload.";
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const foo = await parseWorkExperience(fileBuffer);

    await api.workExperience.addMany(foo);
  } catch (error) {
    console.error(error);
    return "Failed to upload and process the file. Please try again.";
  }

  revalidatePath("/work-experience");

  return "Imported work experience from PDF.";
}
