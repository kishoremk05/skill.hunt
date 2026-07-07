import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "api-send-email-middleware",
      configureServer(server: import("vite").ViteDevServer) {
        server.middlewares.use(async (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: () => void) => {
          if (req.url?.startsWith("/api/send-email") && req.method === "POST") {
            try {
              let body = "";
              req.on("data", (chunk: any) => {
                body += chunk;
              });
              req.on("end", async () => {
                try {
                  const { to, name, inviteLink, password: initialPassword, regeneratePassword, userId, userRole, userDept } = JSON.parse(body);
                  let password = initialPassword;

                  // Load environment variables matching local or Vercel config
                  const env = loadEnv(mode, process.cwd(), "");

                  if (regeneratePassword && userId) {
                    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
                    const supabaseUrl = env.VITE_SUPABASE_URL;

                    if (!serviceRoleKey || !supabaseUrl || serviceRoleKey === "your-service-role-key-here") {
                      res.writeHead(400, { "Content-Type": "application/json" });
                      res.end(JSON.stringify({ error: "Please configure your real SUPABASE_SERVICE_ROLE_KEY in the .env file (found under Supabase Dashboard -> Project Settings -> API -> service_role secret key) to allow password regeneration." }));
                      return;
                    }

                    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

                    // 1. Generate new temporary password
                    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
                    let pwd = "";
                    for (let i = 0; i < 12; i++) {
                      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    const newPassword = "Fac_" + pwd;

                    // 2. Update auth.users credentials
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

                    // 3. Update public.profiles metadata
                    const { error: profileError } = await supabaseAdmin
                      .from("profiles")
                      .update({ 
                        avatar_url: `__TEMP_PWD__:${newPassword}`,
                        status: "pending"
                      })
                      .eq("id", userId);
                    if (profileError) throw profileError;

                    password = newPassword;
                  }

                  const host = env.PLATFORM_SMTP_HOST || "smtp.gmail.com";
                  const port = Number(env.PLATFORM_SMTP_PORT || 587);
                  const secure = env.PLATFORM_SMTP_SECURE === "true";
                  const user = env.PLATFORM_SMTP_USER || "theboysofficialone@gmail.com";
                  const pass = env.PLATFORM_SMTP_PASS || "abqz caok ysee brug";
                  const senderEmail = env.PLATFORM_SENDER_EMAIL || "theboysofficialone@gmail.com";
                  const senderName = env.PLATFORM_SENDER_NAME || "SkillHunt";

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
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ success: true, newPassword: password }));
                } catch (err: any) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: err.message || "Failed to send email" }));
                }
              });
            } catch (err: any) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
            }
            return;
          }
          next();
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
