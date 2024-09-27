"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/");
    setIsLoggingOut(false);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full justify-start"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span className="mr-2">{isLoggingOut ? "Logging out..." : "Logout"}</span>
      <span className="sr-only">(logs you out of your account)</span>
    </Button>
  );
}
