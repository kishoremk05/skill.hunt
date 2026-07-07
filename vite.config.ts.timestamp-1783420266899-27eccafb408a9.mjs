// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/node_modules/lovable-tagger/dist/index.js";
import nodemailer from "file:///C:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/node_modules/nodemailer/lib/nodemailer.js";
import { createClient } from "file:///C:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/node_modules/@supabase/supabase-js/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\fiverr projects\\ananya gupta project\\pixel-perfect-marketing-main";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "api-send-email-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith("/api/send-email") && req.method === "POST") {
            try {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", async () => {
                try {
                  const { to, name, inviteLink, password: initialPassword, regeneratePassword, userId, userRole, userDept } = JSON.parse(body);
                  let password = initialPassword;
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
                    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
                    let pwd = "";
                    for (let i = 0; i < 12; i++) {
                      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    const newPassword = "Fac_" + pwd;
                    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
                      password: newPassword,
                      user_metadata: {
                        full_name: name,
                        role: userRole || "faculty",
                        department: userDept || "",
                        status: "pending",
                        avatar_url: `__TEMP_PWD__:${newPassword}`
                      }
                    });
                    if (authError) throw authError;
                    const { error: profileError } = await supabaseAdmin.from("profiles").update({
                      avatar_url: `__TEMP_PWD__:${newPassword}`,
                      status: "pending"
                    }).eq("id", userId);
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
                      pass
                    }
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
                    `
                  };
                  await transporter.sendMail(mailOptions);
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ success: true, newPassword: password }));
                } catch (err) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: err.message || "Failed to send email" }));
                }
              });
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
            }
            return;
          }
          next();
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxmaXZlcnIgcHJvamVjdHNcXFxcYW5hbnlhIGd1cHRhIHByb2plY3RcXFxccGl4ZWwtcGVyZmVjdC1tYXJrZXRpbmctbWFpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZml2ZXJyIHByb2plY3RzXFxcXGFuYW55YSBndXB0YSBwcm9qZWN0XFxcXHBpeGVsLXBlcmZlY3QtbWFya2V0aW5nLW1haW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2ZpdmVyciUyMHByb2plY3RzL2FuYW55YSUyMGd1cHRhJTIwcHJvamVjdC9waXhlbC1wZXJmZWN0LW1hcmtldGluZy1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5pbXBvcnQgbm9kZW1haWxlciBmcm9tIFwibm9kZW1haWxlclwiO1xuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gICAge1xuICAgICAgbmFtZTogXCJhcGktc2VuZC1lbWFpbC1taWRkbGV3YXJlXCIsXG4gICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyOiBpbXBvcnQoXCJ2aXRlXCIpLlZpdGVEZXZTZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxOiBpbXBvcnQoXCJodHRwXCIpLkluY29taW5nTWVzc2FnZSwgcmVzOiBpbXBvcnQoXCJodHRwXCIpLlNlcnZlclJlc3BvbnNlLCBuZXh0OiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcS51cmw/LnN0YXJ0c1dpdGgoXCIvYXBpL3NlbmQtZW1haWxcIikgJiYgcmVxLm1ldGhvZCA9PT0gXCJQT1NUXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGxldCBib2R5ID0gXCJcIjtcbiAgICAgICAgICAgICAgcmVxLm9uKFwiZGF0YVwiLCAoY2h1bms6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGJvZHkgKz0gY2h1bms7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXEub24oXCJlbmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB7IHRvLCBuYW1lLCBpbnZpdGVMaW5rLCBwYXNzd29yZDogaW5pdGlhbFBhc3N3b3JkLCByZWdlbmVyYXRlUGFzc3dvcmQsIHVzZXJJZCwgdXNlclJvbGUsIHVzZXJEZXB0IH0gPSBKU09OLnBhcnNlKGJvZHkpO1xuICAgICAgICAgICAgICAgICAgbGV0IHBhc3N3b3JkID0gaW5pdGlhbFBhc3N3b3JkO1xuXG4gICAgICAgICAgICAgICAgICAvLyBMb2FkIGVudmlyb25tZW50IHZhcmlhYmxlcyBtYXRjaGluZyBsb2NhbCBvciBWZXJjZWwgY29uZmlnXG4gICAgICAgICAgICAgICAgICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksIFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgICBpZiAocmVnZW5lcmF0ZVBhc3N3b3JkICYmIHVzZXJJZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2aWNlUm9sZUtleSA9IGVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdXBhYmFzZVVybCA9IGVudi5WSVRFX1NVUEFCQVNFX1VSTDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlcnZpY2VSb2xlS2V5IHx8ICFzdXBhYmFzZVVybCB8fCBzZXJ2aWNlUm9sZUtleSA9PT0gXCJ5b3VyLXNlcnZpY2Utcm9sZS1rZXktaGVyZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIlBsZWFzZSBjb25maWd1cmUgeW91ciByZWFsIFNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkgaW4gdGhlIC5lbnYgZmlsZSAoZm91bmQgdW5kZXIgU3VwYWJhc2UgRGFzaGJvYXJkIC0+IFByb2plY3QgU2V0dGluZ3MgLT4gQVBJIC0+IHNlcnZpY2Vfcm9sZSBzZWNyZXQga2V5KSB0byBhbGxvdyBwYXNzd29yZCByZWdlbmVyYXRpb24uXCIgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHNlcnZpY2VSb2xlS2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyAxLiBHZW5lcmF0ZSBuZXcgdGVtcG9yYXJ5IHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoYXJzID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OSFAIyQlXiYqXCI7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwd2QgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICBwd2QgKz0gY2hhcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJzLmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Bhc3N3b3JkID0gXCJGYWNfXCIgKyBwd2Q7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gMi4gVXBkYXRlIGF1dGgudXNlcnMgY3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBlcnJvcjogYXV0aEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmF1dGguYWRtaW4udXBkYXRlVXNlckJ5SWQodXNlcklkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IG5ld1Bhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgIHVzZXJfbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxfbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IHVzZXJSb2xlIHx8IFwiZmFjdWx0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0bWVudDogdXNlckRlcHQgfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogXCJwZW5kaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJfdXJsOiBgX19URU1QX1BXRF9fOiR7bmV3UGFzc3dvcmR9YCxcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0aEVycm9yKSB0aHJvdyBhdXRoRXJyb3I7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gMy4gVXBkYXRlIHB1YmxpYy5wcm9maWxlcyBtZXRhZGF0YVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgICAgICAgICAgICAgICAgICAuZnJvbShcInByb2ZpbGVzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7IFxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyX3VybDogYF9fVEVNUF9QV0RfXzoke25ld1Bhc3N3b3JkfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IFwicGVuZGluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuZXEoXCJpZFwiLCB1c2VySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZmlsZUVycm9yKSB0aHJvdyBwcm9maWxlRXJyb3I7XG5cbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQgPSBuZXdQYXNzd29yZDtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgY29uc3QgaG9zdCA9IGVudi5QTEFURk9STV9TTVRQX0hPU1QgfHwgXCJzbXRwLmdtYWlsLmNvbVwiO1xuICAgICAgICAgICAgICAgICAgY29uc3QgcG9ydCA9IE51bWJlcihlbnYuUExBVEZPUk1fU01UUF9QT1JUIHx8IDU4Nyk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBzZWN1cmUgPSBlbnYuUExBVEZPUk1fU01UUF9TRUNVUkUgPT09IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IGVudi5QTEFURk9STV9TTVRQX1VTRVIgfHwgXCJ0aGVib3lzb2ZmaWNpYWxvbmVAZ21haWwuY29tXCI7XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXNzID0gZW52LlBMQVRGT1JNX1NNVFBfUEFTUyB8fCBcImFicXogY2FvayB5c2VlIGJydWdcIjtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbmRlckVtYWlsID0gZW52LlBMQVRGT1JNX1NFTkRFUl9FTUFJTCB8fCBcInRoZWJveXNvZmZpY2lhbG9uZUBnbWFpbC5jb21cIjtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbmRlck5hbWUgPSBlbnYuUExBVEZPUk1fU0VOREVSX05BTUUgfHwgXCJTa2lsbEh1bnRcIjtcblxuICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNwb3J0ZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XG4gICAgICAgICAgICAgICAgICAgIGhvc3QsXG4gICAgICAgICAgICAgICAgICAgIHBvcnQsXG4gICAgICAgICAgICAgICAgICAgIHNlY3VyZSxcbiAgICAgICAgICAgICAgICAgICAgYXV0aDoge1xuICAgICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFzcyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBjb25zdCBtYWlsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogYFwiJHtzZW5kZXJOYW1lfVwiIDwke3NlbmRlckVtYWlsfT5gLFxuICAgICAgICAgICAgICAgICAgICB0byxcbiAgICAgICAgICAgICAgICAgICAgc3ViamVjdDogXCJJbnZpdGF0aW9uIHRvIGpvaW4gU2tpbGwgSHVudCBhcyBGYWN1bHR5XCIsXG4gICAgICAgICAgICAgICAgICAgIGh0bWw6IGBcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7IG1heC13aWR0aDogNjAwcHg7IG1hcmdpbjogMCBhdXRvOyBwYWRkaW5nOiAzMHB4OyBib3JkZXI6IDFweCBzb2xpZCAjZTJlOGYwOyBib3JkZXItcmFkaXVzOiAxNnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmOyBjb2xvcjogIzFhMWExYTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7IG1hcmdpbi1ib3R0b206IDI1cHg7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT1cImNvbG9yOiAjMTExODI3OyBtYXJnaW46IDA7IGZvbnQtc2l6ZTogMjRweDsgZm9udC13ZWlnaHQ6IDgwMDsgdHJhY2tpbmc6IC0wLjAyNWVtO1wiPldlbGNvbWUgdG8gU2tpbGwgSHVudDwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPVwiY29sb3I6ICM0YjU1NjM7IGZvbnQtc2l6ZTogMTRweDsgbWFyZ2luLXRvcDogNXB4O1wiPkFjYWRlbWljIEV2ZW50IFNob3djYXNlcyBQbGF0Zm9ybTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT1cImZvbnQtc2l6ZTogMTVweDsgbGluZS1oZWlnaHQ6IDEuNjsgY29sb3I6ICMzNzQxNTE7XCI+SGVsbG8gPHN0cm9uZz4ke25hbWV9PC9zdHJvbmc+LDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9XCJmb250LXNpemU6IDE1cHg7IGxpbmUtaGVpZ2h0OiAxLjY7IGNvbG9yOiAjMzc0MTUxO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBZb3UgaGF2ZSBiZWVuIGludml0ZWQgYW5kIHJlZ2lzdGVyZWQgYXMgYSA8c3Ryb25nPkZhY3VsdHkgRXZhbHVhdG9yPC9zdHJvbmc+IG9uIFNraWxsIEh1bnQuIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBVc2UgdGhlIGNyZWRlbnRpYWxzIGJlbG93IHRvIGFjY2VzcyB0aGUgZGFzaGJvYXJkIGFuZCByZXZpZXcgeW91ciBhc3NpZ25lZCBzdHVkZW50IHByb2plY3RzOlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjsgcGFkZGluZzogMjBweDsgYm9yZGVyLXJhZGl1czogMTJweDsgbWFyZ2luOiAyNXB4IDA7IGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOiAwOyBmb250LXNpemU6IDE0cHg7IGNvbG9yOiAjNGI1NTYzO1wiPjxzdHJvbmc+TG9naW4gRW1haWw6PC9zdHJvbmc+IDxzcGFuIHN0eWxlPVwiY29sb3I6ICMxMTE4Mjc7IGZvbnQtd2VpZ2h0OiA2MDA7XCI+JHt0b308L3NwYW4+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbjogMTBweCAwIDAgMDsgZm9udC1zaXplOiAxNHB4OyBjb2xvcjogIzRiNTU2MztcIj48c3Ryb25nPlRlbXBvcmFyeSBQYXNzd29yZDo8L3N0cm9uZz4gPHNwYW4gc3R5bGU9XCJjb2xvcjogIzExMTgyNzsgZm9udC13ZWlnaHQ6IDYwMDsgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcIj4ke3Bhc3N3b3JkfTwvc3Bhbj48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9XCJmb250LXNpemU6IDE1cHg7IGxpbmUtaGVpZ2h0OiAxLjY7IGNvbG9yOiAjMzc0MTUxOyBtYXJnaW4tYm90dG9tOiAzMHB4O1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2UgY2xpY2sgdGhlIGJ1dHRvbiBiZWxvdyB0byBzaWduIGluIGRpcmVjdGx5IGFuZCB1cGRhdGUgeW91ciBwcm9maWxlIGRldGFpbHM6XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7IG1hcmdpbjogMzBweCAwO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHtpbnZpdGVMaW5rfVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogIzExMTgyNzsgY29sb3I6ICNmZmZmZmY7IHBhZGRpbmc6IDE0cHggMjhweDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBib3JkZXItcmFkaXVzOiAxMHB4OyBmb250LXdlaWdodDogYm9sZDsgZm9udC1zaXplOiAxNHB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGJveC1zaGFkb3c6IDAgNHB4IDZweCAtMXB4IHJnYmEoMCwwLDAsMC4xKTtcIj5Mb2cgSW4gdG8gRGFzaGJvYXJkPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPVwiZm9udC1zaXplOiAxM3B4OyBjb2xvcjogIzZiNzI4MDsgbGluZS1oZWlnaHQ6IDEuNTsgbWFyZ2luLXRvcDogMzBweDtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgTm90ZTogRm9yIHNlY3VyaXR5IHJlYXNvbnMsIHdlIHJlY29tbWVuZCB1cGRhdGluZyB5b3VyIHRlbXBvcmFyeSBwYXNzd29yZCBvbiB0aGUgUHJvZmlsZSBwYWdlIGFmdGVyIHlvdXIgaW5pdGlhbCBzaWduLWluLlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHIgc3R5bGU9XCJib3JkZXI6IDA7IGJvcmRlci10b3A6IDFweCBzb2xpZCAjZTVlN2ViOyBtYXJnaW46IDMwcHggMDtcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT1cImZvbnQtc2l6ZTogMTFweDsgY29sb3I6ICM5Y2EzYWY7IG1hcmdpbjogMDtcIj5UaGlzIGludml0YXRpb24gd2FzIHNlbnQgdG8gJHt0b30gYnkgdGhlIFBsYXRmb3JtIEFkbWluaXN0cmF0b3IuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT1cImZvbnQtc2l6ZTogMTFweDsgY29sb3I6ICM5Y2EzYWY7IG1hcmdpbjogNXB4IDAgMCAwO1wiPiZjb3B5OyAyMDI2IFNraWxsIEh1bnQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIGAsXG4gICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICBhd2FpdCB0cmFuc3BvcnRlci5zZW5kTWFpbChtYWlsT3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwgeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcbiAgICAgICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiB0cnVlLCBuZXdQYXNzd29yZDogcGFzc3dvcmQgfSkpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwgeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcbiAgICAgICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogZXJyLm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gc2VuZCBlbWFpbFwiIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSk7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogZXJyLm1lc3NhZ2UgfHwgXCJJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIiB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRZLFNBQVMsY0FBYyxlQUFlO0FBQ2xiLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxvQkFBb0I7QUFMN0IsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEs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
