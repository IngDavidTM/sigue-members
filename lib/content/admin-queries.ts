import "server-only";

import { requireAdmin } from "@/lib/auth/authorization";
import { isMissingRelation } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

export async function getBlogTaxonomyOptions() {
  await requireAdmin();
  const supabase = await createClient();
  const [seriesResult, seriesTranslationsResult, tagsResult, tagTranslationsResult] =
    await Promise.all([
      supabase.from("blog_series").select("*").order("sort_order"),
      supabase.from("blog_series_translations").select("*").eq("locale", "es"),
      supabase.from("blog_tags").select("*").order("code"),
      supabase.from("blog_tag_translations").select("*").eq("locale", "es"),
    ]);

  if (seriesResult.error) throw new Error(seriesResult.error.message);
  if (seriesTranslationsResult.error) throw new Error(seriesTranslationsResult.error.message);
  if (tagsResult.error) throw new Error(tagsResult.error.message);
  if (tagTranslationsResult.error) throw new Error(tagTranslationsResult.error.message);

  const seriesTranslations = new Map(
    seriesTranslationsResult.data.map((translation) => [translation.series_id, translation]),
  );
  const tagTranslations = new Map(
    tagTranslationsResult.data.map((translation) => [translation.tag_id, translation]),
  );

  return {
    series: seriesResult.data.map((item) => ({
      ...item,
      translation: seriesTranslations.get(item.id),
    })),
    tags: tagsResult.data.map((item) => ({
      ...item,
      translation: tagTranslations.get(item.id),
    })),
  };
}

export async function getAdminBlogPost(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const [postResult, translationsResult, tagsResult] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("blog_post_translations").select("*").eq("post_id", id),
    supabase.from("blog_post_tags").select("tag_id").eq("post_id", id),
  ]);
  if (postResult.error) throw new Error(postResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  if (tagsResult.error) throw new Error(tagsResult.error.message);
  return {
    post: postResult.data,
    translations: translationsResult.data,
    selectedTagIds: tagsResult.data.map((tag) => tag.tag_id),
  };
}

export async function getEventOptions() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("event_venues").select("*").order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function getAdminEvent(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const [eventResult, translationsResult, accessResult] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("event_translations").select("*").eq("event_id", id),
    supabase
      .from("event_private_access")
      .select("virtual_url,organizer_email")
      .eq("event_id", id)
      .maybeSingle(),
  ]);
  if (eventResult.error) throw new Error(eventResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  if (accessResult.error) throw new Error(accessResult.error.message);
  return {
    event: eventResult.data,
    translations: translationsResult.data,
    virtualUrl: accessResult.data?.virtual_url ?? null,
    organizerEmail: accessResult.data?.organizer_email ?? null,
  };
}

export async function getAdminEventRecording(eventId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("event_recordings").select("*").eq("event_id", eventId).maybeSingle();
  if (isMissingRelation(error)) return { recording: null, available: false };
  if (error) throw new Error(error.message);
  return { recording: data, available: true };
}

export async function getAdminOrganizations() {
  await requireAdmin();
  const supabase = await createClient();
  const [organizations, members] = await Promise.all([
    supabase.from("organizations").select("*").order("updated_at", { ascending: false }),
    supabase.from("organization_members").select("organization_id"),
  ]);
  if (isMissingRelation(organizations.error)) return { available: false as const, organizations: [], memberCounts: new Map<string, number>() };
  if (organizations.error) throw new Error(organizations.error.message);
  if (members.error) throw new Error(members.error.message);
  const memberCounts = new Map<string, number>();
  for (const member of members.data) memberCounts.set(member.organization_id, (memberCounts.get(member.organization_id) ?? 0) + 1);
  return { available: true as const, organizations: organizations.data, memberCounts };
}

export async function getAdminOrganization(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const [organization, members, notes, invitations] = await Promise.all([
    supabase.from("organizations").select("*").eq("id", id).maybeSingle(),
    supabase.from("organization_members").select("user_id,role,created_at").eq("organization_id", id).order("created_at"),
    supabase.from("organization_notes").select("*").eq("organization_id", id).order("created_at", { ascending: false }),
    supabase.from("organization_invitations").select("id,email,role,expires_at,accepted_at,created_at").eq("organization_id", id).is("accepted_at", null),
  ]);
  for (const result of [organization, members, notes, invitations]) if (result.error) throw new Error(result.error.message);
  if (!organization.data) return null;
  const people = [...new Set([...members.data!.map((member) => member.user_id), ...notes.data!.map((note) => note.author_id).filter((value): value is string => Boolean(value)), organization.data.reviewed_by].filter((value): value is string => Boolean(value)))];
  const profiles = people.length ? await supabase.from("profiles").select("id,full_name,email").in("id", people) : { data: [], error: null };
  if (profiles.error) throw new Error(profiles.error.message);
  const byId = new Map(profiles.data.map((profile) => [profile.id, profile]));
  return {
    organization: organization.data,
    members: members.data!.map((member) => ({ ...member, profile: byId.get(member.user_id) ?? null })),
    notes: notes.data!.map((note) => ({ ...note, author: note.author_id ? byId.get(note.author_id) ?? null : null })),
    invitations: invitations.data!,
    reviewer: organization.data.reviewed_by ? byId.get(organization.data.reviewed_by) ?? null : null,
  };
}
