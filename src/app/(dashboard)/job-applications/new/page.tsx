import { addJobApplication } from "../_actions/addJobApplication";
import { updateJobApplication } from "../_actions/updateJobApplication";
import { JobApplicationForm } from "../_components/JobApplicationForm";

export default function NewJobApplicationPage() {
  return (
    <JobApplicationForm
      addJobApplication={addJobApplication}
      updateJobApplication={updateJobApplication}
    />
  );
}
