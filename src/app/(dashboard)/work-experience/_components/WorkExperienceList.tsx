import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/server";
import { deleteWorkExperience } from "../_actions/deleteWorkExperience";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";

export async function WorkExperienceList() {
  const experiences = await api.workExperience.all();

  if (experiences.length === 0) {
    return <p>No work experiences added yet.</p>;
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <Card key={experience.id}>
          <CardHeader>
            <CardTitle>
              {experience.title} at {experience.company}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {experience.startDate} - {experience.endDate}
            </p>
            <p>{experience.description}</p>
            <ul className="mt-2 list-inside list-disc">
              {experience.bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <div className="mt-4">
              <strong>Skills:</strong> {experience.skills.join(", ")}
            </div>
            <div className="mt-4 space-x-2">
              <EditButton id={experience.id} />
              <DeleteButton
                id={experience.id}
                deleteWorkExperience={deleteWorkExperience}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
