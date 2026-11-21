import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function hash(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split("/").pop() || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!serviceKey || !supabaseUrl) {
      return json({ error: "Server misconfigured" }, 500);
    }
    const admin = createClient(supabaseUrl, serviceKey);

    const storedHash = async (): Promise<string | null> => {
      const { data, error } = await admin
        .from("admin_auth")
        .select("password_hash")
        .eq("id", 1)
        .maybeSingle();
      if (error || !data) return null;
      return data.password_hash;
    };

    const body = req.method === "POST" && action !== "upload"
      ? await req.json().catch(() => ({}))
      : {};

    const authorize = async (provided: unknown): Promise<boolean> => {
      const expected = await storedHash();
      if (!expected || typeof provided !== "string" || !provided) return false;
      return (await hash(provided)) === expected;
    };

    const unauthorized = () => json({ error: "غير مصرح" }, 401);

    if (action === "login") {
      const hashHex = await hash(String(body.password || ""));
      const expected = await storedHash();
      if (!expected || hashHex !== expected) {
        return json({ error: "كلمة المرور غير صحيحة" }, 401);
      }
      return json({ ok: true });
    }

    if (action === "verify") {
      const expected = await storedHash();
      const ok = !!expected && (await hash(String(body.password || ""))) === expected;
      return json({ ok });
    }

    if (action === "changepassword") {
      if (!(await authorize(body.password))) return unauthorized();
      const currentHash = await hash(String(body.currentPassword || ""));
      const expected = await storedHash();
      if (!expected || currentHash !== expected) {
        return json({ error: "كلمة المرور الحالية غير صحيحة" }, 401);
      }
      if (!body.newPassword || String(body.newPassword).length < 6) {
        return json({ error: "كلمة المرور الجديدة قصيرة جداً" }, 400);
      }
      const newHash = await hash(String(body.newPassword));
      const { error: updateError } = await admin
        .from("admin_auth")
        .update({ password_hash: newHash })
        .eq("id", 1);
      if (updateError) return json({ error: updateError.message }, 500);
      return json({ ok: true });
    }

    if (action === "state") {
      if (!(await authorize(body.password))) return unauthorized();
      const { data, error } = await admin
        .from("phone_state")
        .select("draft, published, published_at")
        .eq("id", 1)
        .maybeSingle();
      if (error || !data) return json({ error: "State not found" }, 500);
      return json({ draft: data.draft, published: data.published, publishedAt: data.published_at });
    }

    if (action === "savedraft") {
      if (!(await authorize(body.password))) return unauthorized();
      const draft = body.draft;
      if (!draft || typeof draft !== "object") {
        return json({ error: "Invalid draft" }, 400);
      }
      const { error } = await admin
        .from("phone_state")
        .update({ draft, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "publish") {
      if (!(await authorize(body.password))) return unauthorized();
      const { data: row, error: readError } = await admin
        .from("phone_state")
        .select("draft")
        .eq("id", 1)
        .maybeSingle();
      if (readError || !row) return json({ error: "State not found" }, 500);
      const { error: updateError } = await admin
        .from("phone_state")
        .update({ published: row.draft, published_at: new Date().toISOString() })
        .eq("id", 1);
      if (updateError) return json({ error: updateError.message }, 500);
      return json({ ok: true });
    }

    if (action === "upload") {
      const formData = await req.formData();
      const file = formData.get("file");
      const albumId = String(formData.get("albumId") || "a-all");
      const authHeader = req.headers.get("Authorization") || "";
      const provided = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
      if (!(await authorize(provided))) return unauthorized();
      if (!(file instanceof File)) return json({ error: "No file provided" }, 400);
      if (!file.type.startsWith("image/")) {
        return json({ error: "الملف يجب أن يكون صورة" }, 400);
      }
      if (file.size > 10 * 1024 * 1024) {
        return json({ error: "حجم الصورة يجب أن يكون أقل من 10 ميجابايت" }, 400);
      }
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `photos/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await admin.storage
        .from("gallery-photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return json({ error: uploadError.message }, 500);
      const { data: publicUrl } = admin.storage.from("gallery-photos").getPublicUrl(path);
      return json({ url: publicUrl.publicUrl, path, albumId });
    }

    if (action === "deletephoto") {
      if (!(await authorize(body.password))) return unauthorized();
      const path = body.path;
      if (!path || typeof path !== "string" || path.includes("..")) {
        return json({ error: "Invalid path" }, 400);
      }
      const { error } = await admin.storage.from("gallery-photos").remove([path]);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 404);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Server error" }, 500);
  }
});

