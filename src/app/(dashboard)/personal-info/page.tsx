import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getCurrentUserWithLoginRedirect } from "~/lib/session";
import { savePersonalInfo } from "./_actions/savePersonalInfo";
import { PersonalDetailsSSR } from "./_components/personal-details-ssr";
import PersonalInfoInputs from "./_components/PersonalInfoInputs";
import { SubmitButton } from "./_components/SubmitButton";

export default async function PersonalInfo() {
  const currentUser = await getCurrentUserWithLoginRedirect();

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details here</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={savePersonalInfo}>
            <PersonalInfoInputs
              familyName={currentUser.familyName}
              givenName={currentUser.givenName}
              image={currentUser.image}
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <Suspense fallback={null}>
        <PersonalDetailsSSR />
      </Suspense>
    </div>
  );
}
