"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function ConnectProviderButton({
  provider,
  children,
}: {
  provider: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="default"
      className="flex w-auto items-center justify-start gap-4 px-4 py-2"
      onClick={async () => {
        await signIn(provider);
      }}
    >
      {children}
    </Button>
  );
}
