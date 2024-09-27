import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { type ClientSafeProvider, getProviders } from "next-auth/react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Doc } from "~/server/db/types";
import { api } from "~/trpc/server";
import { ConnectProviderButton } from "./ConnectProviderButton";

function getIcon(type: Doc<"accounts">["provider"]) {
  switch (type) {
    case "github":
      return <GitHubLogoIcon className="h-4 w-4" />;
    case "linkedin":
      return <LinkedInLogoIcon className="h-4 w-4" />;
    default:
      return null;
  }
}

export async function ConnectedAccounts() {
  const accounts = await api.user.getConnectedAccounts();

  const formatExpiryDate = (expiresAt: number | null) => {
    if (!expiresAt) return "N/A";
    return new Date(expiresAt * 1000).toLocaleString();
  };

  const providers = await getProviders();

  const enabledProviders: ClientSafeProvider[] = [];
  if (providers) {
    for (const provider of Object.values(providers)) {
      enabledProviders.push(provider);
    }
  }

  const possibleOAuthProviders = enabledProviders.filter(
    (provider) =>
      provider.type === "oauth" &&
      !accounts.some((acc) => acc.provider === provider.id),
  );

  return (
    <div className="flex flex-col gap-8">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your connected accounts and login methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {accounts.map((account, index) => (
              <li key={index}>
                <Card>
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="bg-primary-50 rounded-full p-2">
                      {getIcon(account.provider)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {account.provider}
                      </CardTitle>
                      <CardDescription>{account.type}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {account.type === "email" ? "Email" : "OAuth"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="font-medium text-gray-500">User ID</dt>
                      <dd className="text-gray-700">{account.userId}</dd>
                      <dt className="font-medium text-gray-500">
                        Provider Account ID
                      </dt>
                      <dd className="text-gray-700">
                        {account.providerAccountId}
                      </dd>
                      {account.scope && (
                        <>
                          <dt className="font-medium text-gray-500">Scope</dt>
                          <dd className="text-gray-700">{account.scope}</dd>
                        </>
                      )}
                      {account.expires_at && (
                        <>
                          <dt className="font-medium text-gray-500">
                            Expires At
                          </dt>
                          <dd className="text-gray-700">
                            {formatExpiryDate(account.expires_at)}
                          </dd>
                        </>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {possibleOAuthProviders.length > 0 ? (
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Connect New Account</CardTitle>
            <CardDescription>
              Connect a new account to enable login with OAuth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {possibleOAuthProviders.map((provider, index) => (
                <li key={index}>
                  <ConnectProviderButton provider={provider.id}>
                    {getIcon(provider.id)} Connect with {provider.name}
                  </ConnectProviderButton>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
