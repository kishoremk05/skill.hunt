import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Missing Supabase configuration environment variables." });
  }

  // Use admin client to bypass RLS policies
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const projectId = req.query.projectId as string;

  try {
    let projectsToCheck: any[] = [];

    if (projectId) {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select("id, demo_url")
        .eq("id", projectId)
        .single();
      
      if (error) throw error;
      if (data) projectsToCheck.push(data);
    } else {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select("id, demo_url")
        .not("demo_url", "is", null);

      if (error) throw error;
      if (data) {
        projectsToCheck = data.filter((p: any) => p.demo_url && p.demo_url.trim() !== "");
      }
    }

    const results = [];
    for (const p of projectsToCheck) {
      let isLive = false;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const response = await fetch(p.demo_url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SkillHuntHealthChecker/1.0"
          }
        });
        clearTimeout(timeoutId);
        isLive = response.ok || response.status < 400;
      } catch (err) {
        isLive = false;
      }

      const status = isLive ? "live" : "down";
      const { error: updateError } = await supabaseAdmin
        .from("projects")
        .update({ preview_status: status })
        .eq("id", p.id);

      results.push({
        id: p.id,
        url: p.demo_url,
        status,
        error: updateError ? updateError.message : null
      });
    }

    return res.status(200).json({ checked: results.length, results });
  } catch (err: any) {
    console.error("Health check cron error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
