import { revalidatePath } from "next/cache";
import { generateCV } from "~/server/ai/generateCV";
import { api } from "~/trpc/server";

export async function generateMarkdownCV(id: string) {
  "use server";

  let generatedMarkdown = await generateCV(id);

  if (generatedMarkdown.startsWith("```markdown")) {
    generatedMarkdown = generatedMarkdown.slice(11, -3).trim();
  }

  await api.jobApplication.updateCV({
    id,
    markdown: generatedMarkdown,
  });

  revalidatePath(`/job-applications/${id}`);

  console.log(generatedMarkdown);

  return generatedMarkdown;
}
