import { Suspense } from "react";
import { api } from "~/trpc/server";
import { ConnectedAccounts } from "./_components/ConnectedAccounts";

export default async function AccountPage() {
  const userInfo = await api.user.me();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Account Management</h1>
      <Suspense>
        <ConnectedAccounts />
      </Suspense>
    </div>
  );
}
