import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { addWorkExperience } from "./_actions/addWorkExperience";
import { WorkExperienceForm } from "./_components/WorkExperienceForm";
import { WorkExperienceList } from "./_components/WorkExperienceList";

export const maxDuration = 60;

export default function WorkExperiencePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>Manage your work experience entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <WorkExperienceList />
          </Suspense>
        </CardContent>
      </Card>
      <WorkExperienceForm addWorkExperience={addWorkExperience} />
    </div>
  );
}
