import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export async function deleteJobApplication(id: string) {
  "use server";

  const deletedApplication = await api.jobApplication.delete(id);

  revalidatePath(`/job-applications/${id}`);
  revalidatePath("/job-applications");

  return deletedApplication;
}
