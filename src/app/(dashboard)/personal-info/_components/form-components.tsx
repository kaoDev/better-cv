"use client";

import { useState } from "react";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  contactDetailSchema,
  educationSchema,
  languageSchema,
  referenceSchema,
} from "~/server/personal-details/helpers";
import { contactDetailEnumValues } from "~/utils/enums";

export function ContactDetailForm({
  initialData,
  onSave,
}: {
  initialData: z.infer<typeof contactDetailSchema> | null;
  onSave: (data: z.infer<typeof contactDetailSchema>) => Promise<void>;
}) {
  const [data, setData] = useState(initialData ?? { type: "", value: "" });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(contactDetailSchema.parse(data));
      }}
      className="space-y-4"
    >
      <Select
        value={data.type}
        onValueChange={(value) =>
          setData({
            ...data,
            type: value as z.infer<typeof contactDetailSchema>["type"],
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select contact type" />
        </SelectTrigger>
        <SelectContent>
          {contactDetailEnumValues.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={data.value}
        onChange={(e) => setData({ ...data, value: e.target.value })}
        placeholder="Value"
      />
      <Button type="submit">Save</Button>
    </form>
  );
}

export function EducationForm({
  initialData,
  onSave,
}: {
  initialData: z.infer<typeof educationSchema> | null;
  onSave: (data: z.infer<typeof educationSchema>) => Promise<void>;
}) {
  const [data, setData] = useState(
    initialData ?? { institute: "", title: "", timeFrame: "" },
  );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(educationSchema.parse(data));
      }}
      className="space-y-4"
    >
      <Input
        value={data.institute}
        onChange={(e) => setData({ ...data, institute: e.target.value })}
        placeholder="Institute"
      />
      <Input
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="Title"
      />
      <Input
        value={data.timeFrame}
        onChange={(e) => setData({ ...data, timeFrame: e.target.value })}
        placeholder="Time Frame"
      />
      <Button type="submit">Save</Button>
    </form>
  );
}

export function LanguageForm({
  initialData,
  onSave,
}: {
  initialData: z.infer<typeof languageSchema> | null;
  onSave: (data: z.infer<typeof languageSchema>) => Promise<void>;
}) {
  const [data, setData] = useState(
    initialData ?? { name: "", proficiency: "" },
  );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(languageSchema.parse(data));
      }}
      className="space-y-4"
    >
      <Input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="Language Name"
      />
      <Input
        value={data.proficiency}
        onChange={(e) => setData({ ...data, proficiency: e.target.value })}
        placeholder="Proficiency"
      />
      <Button type="submit">Save</Button>
    </form>
  );
}

export function ReferenceForm({
  initialData,
  onSave,
}: {
  initialData: z.infer<typeof referenceSchema> | null;
  onSave: (data: z.infer<typeof referenceSchema>) => Promise<void>;
}) {
  const [data, setData] = useState(
    initialData ?? { name: "", position: "", company: "", contact: "" },
  );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(referenceSchema.parse(data));
      }}
      className="space-y-4"
    >
      <Input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="Name"
      />
      <Input
        value={data.position}
        onChange={(e) => setData({ ...data, position: e.target.value })}
        placeholder="Position"
      />
      <Input
        value={data.company}
        onChange={(e) => setData({ ...data, company: e.target.value })}
        placeholder="Company"
      />
      <Input
        value={data.contact}
        onChange={(e) => setData({ ...data, contact: e.target.value })}
        placeholder="Contact"
      />
      <Button type="submit">Save</Button>
    </form>
  );
}
