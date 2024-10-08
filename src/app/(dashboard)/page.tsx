import { redirect } from "next/navigation";
import { getSession } from "~/lib/session";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return redirect("/api/auth/signin");
  }

  redirect("/personal-info");
}
