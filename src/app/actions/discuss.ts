"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, isDatabaseConfigured, schema } from "@/db";
import { isAdmin, displayNameFromUser } from "@/lib/admin";
import { isClerkConfigured, safeAuth, safeCurrentUser } from "@/lib/auth-safe";
import { imageUrlFromUser } from "@/lib/author-image";

function requireDb() {
  if (!isDatabaseConfigured()) {
    throw new Error("Discussion DB not configured");
  }
  return getDb();
}

async function requireSignedIn() {
  if (!isClerkConfigured()) throw new Error("Auth is not configured");
  const { userId } = await safeAuth();
  if (!userId) throw new Error("Sign in required");
  const user = await safeCurrentUser();
  if (!user) throw new Error("Sign in required");
  return {
    userId,
    displayName: displayNameFromUser(user),
    imageUrl: imageUrlFromUser(user),
  };
}

export async function createThread(formData: FormData) {
  requireDb();
  const { userId, displayName, imageUrl } = await requireSignedIn();
  const topicId = String(formData.get("topicId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const topicSlug = String(formData.get("topicSlug") ?? "").trim();

  if (!topicId || !title || !body) {
    throw new Error("Title and body are required");
  }
  if (title.length > 200) throw new Error("Title is too long");
  if (body.length > 10000) throw new Error("Body is too long");

  const db = getDb();
  const [thread] = await db
    .insert(schema.threads)
    .values({
      topicId,
      authorClerkId: userId,
      authorDisplayName: displayName,
      authorImageUrl: imageUrl,
      title,
      body,
    })
    .returning({ id: schema.threads.id });

  revalidatePath("/discuss");
  revalidatePath(`/discuss/${topicSlug}`);
  return { threadId: thread.id, topicSlug };
}

export async function createReply(formData: FormData) {
  requireDb();
  const { userId, displayName, imageUrl } = await requireSignedIn();
  const threadId = String(formData.get("threadId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const topicSlug = String(formData.get("topicSlug") ?? "").trim();

  if (!threadId || !body) throw new Error("Reply body is required");
  if (body.length > 10000) throw new Error("Reply is too long");

  const db = getDb();
  const existing = await db
    .select({ id: schema.threads.id, hiddenAt: schema.threads.hiddenAt })
    .from(schema.threads)
    .where(eq(schema.threads.id, threadId))
    .limit(1);
  if (!existing[0] || existing[0].hiddenAt) {
    throw new Error("Thread not found");
  }

  await db.insert(schema.replies).values({
    threadId,
    authorClerkId: userId,
    authorDisplayName: displayName,
    authorImageUrl: imageUrl,
    body,
  });

  revalidatePath(`/discuss/${topicSlug}/${threadId}`);
  revalidatePath(`/discuss/${topicSlug}`);
}

export async function reportContent(formData: FormData) {
  requireDb();
  const { userId } = await requireSignedIn();
  const targetType = String(formData.get("targetType") ?? "").trim();
  const targetId = String(formData.get("targetId") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || "reported";

  if (targetType !== "thread" && targetType !== "reply") {
    throw new Error("Invalid report target");
  }
  if (!targetId) throw new Error("Missing target");

  const db = getDb();
  await db.insert(schema.reports).values({
    targetType,
    targetId,
    reporterClerkId: userId,
    reason: reason.slice(0, 500),
  });
}

export async function hideContent(formData: FormData) {
  requireDb();
  if (!(await isAdmin())) throw new Error("Admin only");

  const targetType = String(formData.get("targetType") ?? "").trim();
  const targetId = String(formData.get("targetId") ?? "").trim();
  const action = String(formData.get("action") ?? "hide").trim();
  const topicSlug = String(formData.get("topicSlug") ?? "").trim();
  const threadId = String(formData.get("threadId") ?? "").trim();

  if (!targetId) throw new Error("Missing target");
  const db = getDb();
  const hiddenAt = action === "unhide" ? null : new Date();

  if (targetType === "thread") {
    await db
      .update(schema.threads)
      .set({ hiddenAt })
      .where(eq(schema.threads.id, targetId));
  } else if (targetType === "reply") {
    await db
      .update(schema.replies)
      .set({ hiddenAt })
      .where(eq(schema.replies.id, targetId));
  } else {
    throw new Error("Invalid target type");
  }

  if (topicSlug) {
    revalidatePath(`/discuss/${topicSlug}`);
    if (threadId) revalidatePath(`/discuss/${topicSlug}/${threadId}`);
    else if (targetType === "thread") {
      revalidatePath(`/discuss/${topicSlug}/${targetId}`);
    }
  }
  revalidatePath("/discuss");
}

export async function softDeleteContent(formData: FormData) {
  formData.set("action", "hide");
  return hideContent(formData);
}
