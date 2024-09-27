"use client";

import { useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ListEditor } from "~/components/ui/list-editor";
import { Doc } from "~/server/db/types";
import {
  contactDetailSchema,
  educationSchema,
  languageSchema,
  referenceSchema,
} from "~/server/personal-details/helpers";
import {
  ContactDetailForm,
  EducationForm,
  LanguageForm,
  ReferenceForm,
} from "./form-components";

interface Props {
  addContactDetail: (
    data: z.infer<typeof contactDetailSchema>,
  ) => Promise<{ success: boolean }>;
  updateContactDetail: (
    id: string,
    data: z.infer<typeof contactDetailSchema>,
  ) => Promise<{ success: boolean }>;
  deleteContactDetail: (id: string) => Promise<{ success: boolean }>;
  addEducation: (
    data: z.infer<typeof educationSchema>,
  ) => Promise<{ success: boolean }>;
  updateEducation: (
    id: string,
    data: z.infer<typeof educationSchema>,
  ) => Promise<{ success: boolean }>;
  deleteEducation: (id: string) => Promise<{ success: boolean }>;
  addLanguage: (
    data: z.infer<typeof languageSchema>,
  ) => Promise<{ success: boolean }>;
  updateLanguage: (
    id: string,
    data: z.infer<typeof languageSchema>,
  ) => Promise<{ success: boolean }>;
  deleteLanguage: (id: string) => Promise<{ success: boolean }>;
  addReference: (
    data: z.infer<typeof referenceSchema>,
  ) => Promise<{ success: boolean }>;
  updateReference: (
    id: string,
    data: z.infer<typeof referenceSchema>,
  ) => Promise<{ success: boolean }>;
  deleteReference: (id: string) => Promise<{ success: boolean }>;
  initialState: {
    contactDetails: Doc<"contactDetails">[];
    educations: Doc<"educations">[];
    languages: Doc<"languages">[];
    references: Doc<"references">[];
  };
}

export default function PersonalDetails({
  addContactDetail,
  updateContactDetail,
  deleteContactDetail,
  addEducation,
  updateEducation,
  deleteEducation,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addReference,
  updateReference,
  deleteReference,
  initialState,
}: Props) {
  const [contactDetails, setContactDetails] = useState<
    (z.infer<typeof contactDetailSchema> & { id: string })[]
  >(initialState.contactDetails);
  const [education, setEducation] = useState<
    (z.infer<typeof educationSchema> & { id: string })[]
  >(initialState.educations);
  const [languages, setLanguages] = useState<
    (z.infer<typeof languageSchema> & { id: string })[]
  >(initialState.languages);
  const [references, setReferences] = useState<
    (z.infer<typeof referenceSchema> & { id: string })[]
  >(initialState.references);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Personal Details</h2>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor
            items={contactDetails}
            onAdd={async (item) => {
              const result = await addContactDetail(item);
              if (result.success) {
                setContactDetails([
                  ...contactDetails,
                  { ...item, id: Date.now().toString() },
                ]);
              }
            }}
            onEdit={async (id, item) => {
              const result = await updateContactDetail(id, item);
              if (result.success) {
                setContactDetails(
                  contactDetails.map((cd) =>
                    cd.id === id ? { ...item, id } : cd,
                  ),
                );
              }
            }}
            onDelete={async (id) => {
              const result = await deleteContactDetail(id);
              if (result.success) {
                setContactDetails(contactDetails.filter((cd) => cd.id !== id));
              }
            }}
            renderItem={(item) => (
              <div>
                <strong>{item.type}:</strong> {item.value}
              </div>
            )}
            renderForm={(item, onSave) => (
              <ContactDetailForm initialData={item} onSave={onSave} />
            )}
            itemName="Contact Detail"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor
            items={education}
            onAdd={async (item) => {
              const result = await addEducation(item);
              if (result.success) {
                setEducation([
                  ...education,
                  { ...item, id: Date.now().toString() },
                ]);
              }
            }}
            onEdit={async (id, item) => {
              const result = await updateEducation(id, item);
              if (result.success) {
                setEducation(
                  education.map((ed) => (ed.id === id ? { ...item, id } : ed)),
                );
              }
            }}
            onDelete={async (id) => {
              const result = await deleteEducation(id);
              if (result.success) {
                setEducation(education.filter((ed) => ed.id !== id));
              }
            }}
            renderItem={(item) => (
              <div>
                <strong>{item.institute}</strong> - {item.title} (
                {item.timeFrame})
              </div>
            )}
            renderForm={(item, onSave) => (
              <EducationForm initialData={item} onSave={onSave} />
            )}
            itemName="Education"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor
            items={languages}
            onAdd={async (item) => {
              const result = await addLanguage(item);
              if (result.success) {
                setLanguages([
                  ...languages,
                  { ...item, id: Date.now().toString() },
                ]);
              }
            }}
            onEdit={async (id, item) => {
              const result = await updateLanguage(id, item);
              if (result.success) {
                setLanguages(
                  languages.map((lang) =>
                    lang.id === id ? { ...item, id } : lang,
                  ),
                );
              }
            }}
            onDelete={async (id) => {
              const result = await deleteLanguage(id);
              if (result.success) {
                setLanguages(languages.filter((lang) => lang.id !== id));
              }
            }}
            renderItem={(item) => (
              <div>
                <strong>{item.name}</strong> - {item.proficiency}
              </div>
            )}
            renderForm={(item, onSave) => (
              <LanguageForm initialData={item} onSave={onSave} />
            )}
            itemName="Language"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor
            items={references}
            onAdd={async (item) => {
              const result = await addReference(item);
              if (result.success) {
                setReferences([
                  ...references,
                  { ...item, id: Date.now().toString() },
                ]);
              }
            }}
            onEdit={async (id, item) => {
              const result = await updateReference(id, item);
              if (result.success) {
                setReferences(
                  references.map((ref) =>
                    ref.id === id ? { ...item, id } : ref,
                  ),
                );
              }
            }}
            onDelete={async (id) => {
              const result = await deleteReference(id);
              if (result.success) {
                setReferences(references.filter((ref) => ref.id !== id));
              }
            }}
            renderItem={(item) => (
              <div>
                <strong>{item.name}</strong> - {item.position} at {item.company}
              </div>
            )}
            renderForm={(item, onSave) => (
              <ReferenceForm initialData={item} onSave={onSave} />
            )}
            itemName="Reference"
          />
        </CardContent>
      </Card>
    </div>
  );
}
