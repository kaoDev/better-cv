import { revalidatePath } from "next/cache";
import { JobApplicationDTO } from "~/server/job-applications/types";
import { api } from "~/trpc/server";

export async function addJobApplication(formData: JobApplicationDTO) {
  "use server";

  const newApplication = await api.jobApplication.add(formData);

  revalidatePath("/job-applications");

  return newApplication;
}
