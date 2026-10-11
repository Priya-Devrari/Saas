
'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// CREATE COMPANION
export const createCompanion = async (
    formData: CreateCompanion
) => {
    const { userId: author } = await auth();

    if (!author) {
        throw new Error("You must be logged in to create a companion");
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("companions")
        .insert({
            ...formData,
            author,
        })
        .select()
        .single();

    if (error || !data) {
        throw new Error(
            error?.message || "Failed to create a companion"
        );
    }

    revalidatePath("/");
    revalidatePath("/companions");
    revalidatePath("/my-journey");

    return data;
};

// GET ALL COMPANIONS
export const getAllCompanions = async ({
    limit = 50,
    page = 1,
    subject,
    topic,
}: GetAllCompanions) => {
    const { userId } = await auth();

    const supabase = createSupabaseClient();

    let query = supabase
        .from("companions")
        .select();

    if (userId) {
        query = query.or(
            `author.is.null,author.eq.${userId}`
        );
    } else {
        query = query.is("author", null);
    }

    if (subject) {
        query = query.ilike(
            "subject",
            `%${subject}%`
        );
    }

    if (topic) {
        query = query.or(
            `topic.ilike.%${topic}%,name.ilike.%${topic}%`
        );
    }

    query = query.range(
        (page - 1) * limit,
        page * limit - 1
    );

    const { data: companions, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return companions ?? [];
};

// GET ONE COMPANION
export const getCompanion = async (id: string) => {
    const { userId } = await auth();

    const supabase = createSupabaseClient();

    let query = supabase
        .from("companions")
        .select()
        .eq("id", id);

    if (userId) {
        query = query.or(
            `author.is.null,author.eq.${userId}`
        );
    } else {
        query = query.is("author", null);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data ?? null;
};

// ADD SESSION TO HISTORY
export const addToSessionHistory = async (
    companionId: string
) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const supabase = createSupabaseClient();

    const {
        data: companion,
        error: companionError,
    } = await supabase
        .from("companions")
        .select("id, author")
        .eq("id", companionId)
        .or(`author.is.null,author.eq.${userId}`)
        .maybeSingle();

    if (companionError) {
        throw new Error(companionError.message);
    }

    if (!companion) {
        throw new Error(
            "You are not allowed to use this companion"
        );
    }

    const { data, error } = await supabase
        .from("session_history")
        .insert({
            companion_id: companionId,
            user_id: userId,
        })
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/my-journey");

    return data;
};

// GET RECENT SESSIONS FOR CURRENT USER
export const getRecentSessions = async (
    limit = 10
): Promise<Companion[]> => {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("session_history")
        .select("companions:companion_id (*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        throw new Error(error.message);
    }

    const seen = new Set<string>();
    const companions: Companion[] = [];

    for (const session of data) {
        const relation = session.companions;

        const items = Array.isArray(relation)
            ? relation
            : relation
                ? [relation]
                : [];

        for (const item of items) {
            if (!item || seen.has(item.id)) {
                continue;
            }

            seen.add(item.id);
            companions.push(item as Companion);
        }
    }

    return companions;
};

// GET SESSIONS FOR A SPECIFIC USER
export const getUserSessions = async (
    userId: string,
    limit = 10
) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("session_history")
        .select("companions:companion_id (*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        throw new Error(error.message);
    }

    return data
        .map(({ companions }) => companions)
        .filter(Boolean);
};

// GET USER'S COMPANIONS
export const getUserCompanions = async (
    userId: string
) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("companions")
        .select()
        .eq("author", userId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// CHECK COMPANION CREATION PERMISSIONS
export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();

    if (!userId) {
        return false;
    }

    const supabase = createSupabaseClient();

    let limit = 0;

    if (has({ plan: "pro" })) {
        return true;
    } else if (has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if (has({ feature: "10_companion_limit" })) {
        limit = 10;
    }

    const { count, error } = await supabase
        .from("companions")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("author", userId);

    if (error) {
        throw new Error(error.message);
    }

    return (count ?? 0) < limit;
};

// ADD BOOKMARK
export const addBookmark = async (
    companionId: string,
    path: string
) => {
    const { userId } = await auth();

    if (!userId) {
        return;
    }

    const supabase = createSupabaseClient();

    const {
        data: companion,
        error: companionError,
    } = await supabase
        .from("companions")
        .select("id")
        .eq("id", companionId)
        .or(`author.is.null,author.eq.${userId}`)
        .maybeSingle();

    if (companionError) {
        throw new Error(companionError.message);
    }

    if (!companion) {
        throw new Error(
            "You are not allowed to bookmark this companion"
        );
    }

    const { data, error } = await supabase
        .from("bookmarks")
        .insert({
            companion_id: companionId,
            user_id: userId,
        })
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(path);
    revalidatePath("/my-journey");

    return data;
};

// REMOVE BOOKMARK
export const removeBookmark = async (
    companionId: string,
    path: string
) => {
    const { userId } = await auth();

    if (!userId) {
        return;
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("companion_id", companionId)
        .eq("user_id", userId)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(path);
    revalidatePath("/my-journey");

    return data;
};

// GET BOOKMARKED COMPANIONS
export const getBookmarkedCompanions = async (
    userId: string
) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("bookmarks")
        .select("companions:companion_id (*)")
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }

    return data
        .map(({ companions }) => companions)
        .filter(Boolean);
};
