import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/server";
import { generateMarkdownCV } from "../_actions/generateMarkdownCV";
import { saveCV } from "../_actions/saveCV";
import { CVEditor } from "../_components/CVEditor";

export default async function JobApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await api.jobApplication.get(params.id);

  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {application.jobTitle} at {application.companyName}
          </CardTitle>
          <Link href={`/job-applications/${params.id}/edit`}>
            <Button>Edit Application</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-medium">Status</dt>
              <dd>{application.applicationStatus}</dd>
            </div>
            <div>
              <dt className="font-medium">Applied Date</dt>
              <dd>{application.appliedDate || "N/A"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium">Job Description</dt>
              <dd className="mt-1 whitespace-pre-wrap">
                {application.jobDescription}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">
                {application.notes || "No notes"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Generated CV</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            CV generation feature coming soon!
          </p>
          <CVEditor
            initialMarkdown={application.generatedCV}
            generateMarkdownCV={generateMarkdownCV}
            jobApplicationId={params.id}
            saveCV={saveCV}
          />
        </CardContent>
      </Card>
    </div>
  );
}
