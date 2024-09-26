import { revalidatePath } from "next/cache";
import { workExperienceClientFormSchema } from "~/server/work-experience/types";
import { api } from "~/trpc/server";

export async function addWorkExperience(data: FormData) {
  "use server";

  const formData = workExperienceClientFormSchema.parse({
    title: data.get("title"),
    company: data.get("company"),
    location: data.get("location"),
    description: data.get("description"),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    bulletPoints: data.getAll("bulletPoints"),
    skills: data.getAll("skills"),
  });

  await api.workExperience.add(formData);

  revalidatePath("/work-experience");

  return;
}
