import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function getCurrentUserWithLoginRedirect() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return redirect("/api/auth/signin");
  }

  const currentUser = await api.user.me();

  if (!currentUser) {
    return redirect("/api/auth/signin");
  }

  return currentUser;
}
