"use client";

import { Button } from "~/components/ui/button";

interface Props {
  jobApplicationId: string;
  generateCV: (jobApplicationId: string) => Promise<string>;
}

export function GenerateButton({ generateCV, jobApplicationId }: Props) {
  return (
    <Button
      className="mt-4"
      onClick={async () => {
        const cvMarkdown = await generateCV(jobApplicationId);

        console.log(cvMarkdown);
      }}
    >
      Generate
    </Button>
  );
}
