import { revalidatePath } from "next/cache";
import { JobApplicationDTO } from "~/server/job-applications/types";
import { api } from "~/trpc/server";

export async function updateJobApplication(
  id: string,
  formData: JobApplicationDTO,
) {
  "use server";

  const updatedApplication = await api.jobApplication.update({
    id,
    data: formData,
  });

  revalidatePath(`/job-applications/${id}`);
  revalidatePath("/job-applications");

  return updatedApplication;
}
