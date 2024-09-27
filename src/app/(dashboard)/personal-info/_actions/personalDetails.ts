import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  contactDetailSchema,
  educationSchema,
  languageSchema,
  referenceSchema,
} from "~/server/personal-details/helpers";
import { api } from "~/trpc/server";

interface Result {
  success: boolean;
}

export async function addContactDetail(
  data: z.infer<typeof contactDetailSchema>,
): Promise<Result> {
  "use server";

  await api.user.addContactDetail(data);

  revalidatePath("/personal-info");

  return { success: true };
}
export async function updateContactDetail(
  id: string,
  data: z.infer<typeof contactDetailSchema>,
): Promise<Result> {
  "use server";

  await api.user.updateContactDetail({ id, data });

  revalidatePath("/personal-info");

  return { success: true };
}
export async function deleteContactDetail(id: string): Promise<Result> {
  "use server";

  await api.user.deleteContactDetail(id);

  revalidatePath("/personal-info");

  return { success: true };
}

export async function addEducation(
  data: z.infer<typeof educationSchema>,
): Promise<Result> {
  "use server";

  await api.user.addEducation(data);

  revalidatePath("/personal-info");

  return { success: true };
}
export async function updateEducation(
  id: string,
  data: z.infer<typeof educationSchema>,
): Promise<Result> {
  "use server";

  await api.user.updateEducation({ id, data });

  revalidatePath("/personal-info");

  return { success: true };
}
export async function deleteEducation(id: string): Promise<Result> {
  "use server";

  await api.user.deleteEducation(id);

  revalidatePath("/personal-info");

  return { success: true };
}

export async function addLanguage(
  data: z.infer<typeof languageSchema>,
): Promise<Result> {
  "use server";

  await api.user.addLanguage(data);

  revalidatePath("/personal-info");

  return { success: true };
}
export async function updateLanguage(
  id: string,
  data: z.infer<typeof languageSchema>,
): Promise<Result> {
  "use server";

  await api.user.updateLanguage({ id, data });

  revalidatePath("/personal-info");

  return { success: true };
}
export async function deleteLanguage(id: string): Promise<Result> {
  "use server";

  await api.user.deleteLanguage(id);

  revalidatePath("/personal-info");

  return { success: true };
}

export async function addReference(
  data: z.infer<typeof referenceSchema>,
): Promise<Result> {
  "use server";

  await api.user.addReference(data);

  revalidatePath("/personal-info");

  return { success: true };
}
export async function updateReference(
  id: string,
  data: z.infer<typeof referenceSchema>,
): Promise<Result> {
  "use server";

  await api.user.updateReference({ id, data });

  revalidatePath("/personal-info");

  return { success: true };
}
export async function deleteReference(id: string): Promise<Result> {
  "use server";

  await api.user.deleteReference(id);

  revalidatePath("/personal-info");

  return { success: true };
}
