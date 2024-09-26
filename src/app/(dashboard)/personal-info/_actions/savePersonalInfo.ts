import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "~/trpc/server";

export async function savePersonalInfo(formData: FormData) {
  "use server";

  const updatedUserData = {
    givenName: z
      .string()
      .optional()
      .parse(formData.get("givenName") ?? undefined),
    familyName: z
      .string()
      .optional()
      .parse(formData.get("familyName") ?? undefined),
    image: z
      .string()
      .optional()
      .parse(formData.get("image") ?? undefined),
  };
  console.log("Saving personal info:", updatedUserData);

  await api.user.update(updatedUserData);

  // Revalidate the current path to update the UI
  revalidatePath("/personal-info");

  return { message: "Personal information saved successfully!" };
}
