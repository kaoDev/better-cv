import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getCurrentUserWithLoginRedirect } from "~/lib/session";
import { savePersonalInfo } from "./_actions/savePersonalInfo";
import PersonalInfoInputs from "./_components/PersonalInfoInputs";
import { SubmitButton } from "./_components/SubmitButton";

export default async function PersonalInfo() {
  const currentUser = await getCurrentUserWithLoginRedirect();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your profile details here</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" action={savePersonalInfo}>
          <PersonalInfoInputs
            familyName={currentUser.family_name}
            givenName={currentUser.given_name}
            image={currentUser.image}
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
