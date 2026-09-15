import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { deliverFormNotification } from "@/lib/forms/notifications";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function hasValidSecret(request: Request) {
  const expected = process.env.CRON_SECRET;
  const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !received) return false;
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}

async function processNotificationQueue(request: Request) {
  if (!process.env.CRON_SECRET) return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  if (!hasValidSecret(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const [queue, cleanup] = await Promise.all([
    supabase
      .from("dynamic_form_notifications")
      .select("submission_id")
      .in("status", ["pending", "failed"])
      .lt("attempts", 5)
      .order("created_at")
      .limit(25),
    supabase
      .from("dynamic_form_submission_attempts")
      .delete()
      .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ]);
  if (queue.error || cleanup.error) return NextResponse.json({ error: "Unable to read notification queue" }, { status: 500 });

  const results = await Promise.all(queue.data.map((item) => deliverFormNotification(item.submission_id)));
  return NextResponse.json({ processed: results.length, sent: results.filter((result) => result === "sent").length, failed: results.filter((result) => result === "failed").length }, { headers: { "cache-control": "no-store" } });
}

export const GET = processNotificationQueue;
export const POST = processNotificationQueue;
