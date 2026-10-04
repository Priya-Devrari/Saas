"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();

  if (!author) {
    throw new Error("User is not authenticated");
  }

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({
      ...formData,
      author,
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Failed to create companion");
  }

  return data[0];
};

export const getCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: {
  limit?: number;
  page?: number;
  subject?: string;
  topic?: string;
}) => {
  const supabase = createSupabaseClient();

  let query = supabase.from("companions").select("*");

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query
      .ilike("topic", `%${topic}%`)
      .or(`name.ilike.%${topic}%`);
  }

  const { data: companions, error } = await query.range(
    (page - 1) * limit,
    page * limit
  );

  if (error) {
    throw new Error(error.message);
  }

  return companions;
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .insert({
      companion_id: companionId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};