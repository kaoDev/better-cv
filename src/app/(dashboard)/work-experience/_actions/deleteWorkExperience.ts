import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export async function deleteWorkExperience(id: string) {
  "use server";

  await api.workExperience.delete(id);

  revalidatePath("/work-experience");

  return;
}
