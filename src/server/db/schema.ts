import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { contactDetailEnumValues } from "~/utils/enums";
import { applicationStatusOptions } from "../job-applications/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `better-cv_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  givenName: varchar("given_name", { length: 255 }),
  familyName: varchar("family_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const contactTypes = pgEnum("contact_type", contactDetailEnumValues);

export const contactDetails = createTable(
  "contact_detail",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    type: contactTypes("type").notNull(),
    value: text("value").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    fk: foreignKey({
      name: "user_id",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const educations = createTable(
  "education",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    institute: text("institute").notNull(),
    title: text("title").notNull(),
    timeFrame: text("time_frame").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    fk: foreignKey({
      name: "user_id",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const languages = createTable(
  "language",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    name: text("name").notNull(),
    proficiency: text("proficiency").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    fk: foreignKey({
      name: "user_id",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const references = createTable(
  "reference",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    name: text("name").notNull(),
    position: text("position").notNull(),
    company: text("company").notNull(),
    contact: text("contact").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    fk: foreignKey({
      name: "user_id",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const workExperiences = createTable(
  "work_experience",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    title: text("title").notNull(),
    description: text("description").notNull(),
    company: text("company").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    bulletPoints: text("bullet_points").array().notNull(),
    skills: text("skills").array().notNull(),
    location: text("location").notNull(),

    embedding: vector("embedding", { dimensions: 1536 }).notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    fk: foreignKey({
      name: "user_id",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const jobApplicationStatus = pgEnum(
  "job_application_status",
  applicationStatusOptions,
);

export const jobApplications = createTable(
  "job_application",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    companyName: text("company_name").notNull(),
    jobTitle: text("job_title").notNull(),
    jobDescription: text("job_description").notNull(),
    applicationStatus: jobApplicationStatus("application_status")
      .notNull()
      .default("draft"),
    appliedDate: text("applied_date"),
    notes: text("notes").notNull().default(""),

    generatedCV: text("generated_cv").notNull().default(""),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    fk: foreignKey({
      name: "user_id",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);
