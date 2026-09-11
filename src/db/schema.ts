import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const reportTargetTypeEnum = pgEnum("report_target_type", [
  "thread",
  "reply",
]);

export const topics = pgTable("topics", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  teachHref: text("teach_href"),
  starterPrompt: text("starter_prompt").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const threads = pgTable("threads", {
  id: uuid("id").defaultRandom().primaryKey(),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id),
  authorClerkId: text("author_clerk_id").notNull(),
  authorDisplayName: text("author_display_name").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  hiddenAt: timestamp("hidden_at", { withTimezone: true }),
});

export const replies = pgTable("replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => threads.id),
  authorClerkId: text("author_clerk_id").notNull(),
  authorDisplayName: text("author_display_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  hiddenAt: timestamp("hidden_at", { withTimezone: true }),
});

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  targetType: reportTargetTypeEnum("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  reporterClerkId: text("reporter_clerk_id").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Topic = typeof topics.$inferSelect;
export type Thread = typeof threads.$inferSelect;
export type Reply = typeof replies.$inferSelect;
export type Report = typeof reports.$inferSelect;
