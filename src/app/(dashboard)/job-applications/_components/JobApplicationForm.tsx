"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { Doc } from "~/server/db/types";
import { JobApplicationDTO } from "~/server/job-applications/types";

interface JobApplicationFormProps {
  initialData?: Doc<"jobApplications">;
  updateJobApplication: (
    id: string,
    formData: JobApplicationDTO,
  ) => Promise<unknown>;
  addJobApplication: (formData: JobApplicationDTO) => Promise<unknown>;
}

export function JobApplicationForm({
  initialData,
  addJobApplication,
  updateJobApplication,
}: JobApplicationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<JobApplicationDTO>({
    companyName: initialData?.companyName || "",
    jobTitle: initialData?.jobTitle || "",
    jobDescription: initialData?.jobDescription || "",
    applicationStatus: initialData?.applicationStatus || "draft",
    appliedDate: initialData?.appliedDate || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      applicationStatus: value as JobApplicationDTO["applicationStatus"],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateJobApplication(initialData.id, formData);
        toast({
          title: "Success",
          description: "Job application updated successfully.",
        });
      } else {
        await addJobApplication(formData);
        toast({
          title: "Success",
          description: "Job application added successfully.",
        });
      }
      router.push("/job-applications");
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error saving the job application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Job Application" : "Add New Job Application"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicationStatus">Application Status</Label>
            <Select
              value={formData.applicationStatus}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="appliedDate">Applied Date</Label>
            <Input
              id="appliedDate"
              name="appliedDate"
              type="date"
              value={formData.appliedDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">
            {initialData ? "Update Application" : "Add Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
