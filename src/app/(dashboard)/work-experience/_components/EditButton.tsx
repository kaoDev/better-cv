"use client";

import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";

export function EditButton({}: { id: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        // Implement edit functionality
        toast({
          title: "Edit functionality",
          description: "Edit functionality not implemented yet.",
        });
      }}
    >
      Edit
    </Button>
  );
}
