import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, name, inviteLink, password: initialPassword, regeneratePassword, userId, userRole, userDept } = req.body;
  let password = initialPassword;

  if (regeneratePassword && userId) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl || serviceRoleKey === "your-service-role-key-here") {
      return res.status(400).json({
        error: "Please configure your real SUPABASE_SERVICE_ROLE_KEY in your environment variables (found under Supabase Dashboard -> Project Settings -> API -> service_role secret key) to allow password regeneration."
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 1. Generate new temporary password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newPassword = "Fac_" + pwd;

    try {
      // 2. Update user credentials in auth.users
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
        user_metadata: {
          full_name: name,
          role: userRole || "faculty",
          department: userDept || "",
          status: "pending",
          avatar_url: `__TEMP_PWD__:${newPassword}`,
        }
      });
      if (authError) throw authError;

      // 3. Update public.profiles avatar_url
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ 
          avatar_url: `__TEMP_PWD__:${newPassword}`,
          status: "pending"
        })
        .eq("id", userId);
      if (profileError) throw profileError;

      // Use the new password for invitation dispatch
      password = newPassword;
    } catch (err: any) {
      console.error("Admin Password Reset Error:", err);
      return res.status(500).json({ error: err.message || "Failed to update user password in database." });
    }
  }

  if (!to || !name || !inviteLink || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get credentials from environment variables
  const host = process.env.PLATFORM_SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.PLATFORM_SMTP_PORT || 587);
  const secure = process.env.PLATFORM_SMTP_SECURE === "true";
  const user = process.env.PLATFORM_SMTP_USER || "theboysofficialone@gmail.com";
  const pass = process.env.PLATFORM_SMTP_PASS || "abqz caok ysee brug";
  const senderEmail = process.env.PLATFORM_SENDER_EMAIL || "theboysofficialone@gmail.com";
  const senderName = process.env.PLATFORM_SENDER_NAME || "SkillHunt";

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject: "Invitation to join Skill Hunt as Faculty",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800; tracking: -0.025em;">Welcome to Skill Hunt</h2>
            <p style="color: #4b5563; font-size: 14px; margin-top: 5px;">Academic Event Showcases Platform</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #374151;">Hello <strong>${name}</strong>,</p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #374151;">
            You have been invited and registered as a <strong>Faculty Evaluator</strong> on Skill Hunt. 
            Use the credentials below to access the dashboard and review your assigned student projects:
          </p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Login Email:</strong> <span style="color: #111827; font-weight: 600;">${to}</span></p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #4b5563;"><strong>Temporary Password:</strong> <span style="color: #111827; font-weight: 600; font-family: monospace;">${password}</span></p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
            Please click the button below to sign in directly and update your profile details:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #111827; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">Log In to Dashboard</a>
          </div>
          
          <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-top: 30px;">
            Note: For security reasons, we recommend updating your temporary password on the Profile page after your initial sign-in.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <div style="text-align: center;">
            <p style="font-size: 11px; color: #9ca3af; margin: 0;">This invitation was sent to ${to} by the Platform Administrator.</p>
            <p style="font-size: 11px; color: #9ca3af; margin: 5px 0 0 0;">&copy; 2026 Skill Hunt. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, newPassword: password });
  } catch (error: any) {
    console.error("SMTP Error:", error);
    return res.status(500).json({ error: error.message || "Failed to send email" });
  }
}
