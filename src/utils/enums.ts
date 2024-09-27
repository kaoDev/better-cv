export const contactDetailEnumValues = [
  "location",
  "phone",
  "email",
  "linkedin",
  "github",
  "twitter",
  "website",
  "threads",
  "pinterest",
  "instagram",
  "facebook",
  "other",
] as const;

export type ContactDetailEnum = (typeof contactDetailEnumValues)[number];
