"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";

export function WorkExperienceForm({
  addWorkExperience,
}: {
  addWorkExperience: (data: FormData) => Promise<unknown>;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    bulletPoints: [""],
    skills: [""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (
    index: number,
    field: "bulletPoints" | "skills",
    value: string,
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: "bulletPoints" | "skills") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestFormData = new FormData();
      requestFormData.append("title", formData.title);
      requestFormData.append("company", formData.company);
      requestFormData.append("location", formData.location);
      requestFormData.append("description", formData.description);
      requestFormData.append("startDate", formData.startDate);
      requestFormData.append("endDate", formData.endDate);
      formData.bulletPoints.forEach((point) =>
        requestFormData.append("bulletPoints", point),
      );
      formData.skills.forEach((skill) =>
        requestFormData.append("skills", skill),
      );

      await addWorkExperience(requestFormData);
      toast({
        title: "Experience added",
        description: "Your work experience has been added successfully.",
      });
      router.refresh();
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        bulletPoints: [""],
        skills: [""],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding your work experience.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Bullet Points</Label>
            {formData.bulletPoints.map((point, index) => (
              <Input
                key={index}
                value={point}
                onChange={(e) =>
                  handleArrayChange(index, "bulletPoints", e.target.value)
                }
                className="mt-2"
              />
            ))}
            <Button
              type="button"
              onClick={() => addArrayItem("bulletPoints")}
              className="mt-2"
            >
              Add Bullet Point
            </Button>
          </div>
          <div>
            <Label>Skills</Label>
            {formData.skills.map((skill, index) => (
              <Input
                key={index}
                value={skill}
                onChange={(e) =>
                  handleArrayChange(index, "skills", e.target.value)
                }
                className="mt-2"
              />
            ))}
            <Button
              type="button"
              onClick={() => addArrayItem("skills")}
              className="mt-2"
            >
              Add Skill
            </Button>
          </div>
          <Button type="submit">Add Work Experience</Button>
        </form>
      </CardContent>
    </Card>
  );
}
