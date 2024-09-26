import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export async function saveCV(id: string, markdown: string) {
  "use server";

  const updatedApplication = await api.jobApplication.updateCV({
    id,
    markdown,
  });

  revalidatePath(`/job-applications/${id}`);

  return updatedApplication;
}
