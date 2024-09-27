import { Suspense } from "react";
import { ConnectedAccounts } from "./_components/ConnectedAccounts";

export default async function AccountPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Account Management</h1>
      <Suspense>
        <ConnectedAccounts />
      </Suspense>
    </div>
  );
}
