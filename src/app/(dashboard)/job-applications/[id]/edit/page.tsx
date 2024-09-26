import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { addJobApplication } from "../../_actions/addJobApplication";
import { updateJobApplication } from "../../_actions/updateJobApplication";
import { JobApplicationForm } from "../../_components/JobApplicationForm";

export default async function EditJobApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await api.jobApplication.get(params.id);

  if (!application) {
    notFound();
  }

  return (
    <JobApplicationForm
      initialData={application}
      addJobApplication={addJobApplication}
      updateJobApplication={updateJobApplication}
    />
  );
}
