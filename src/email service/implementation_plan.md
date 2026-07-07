# Admin Unique Records Filter & Serverless Email Service Plan

This plan details the steps to:
1. Filter out duplicate profiles and projects in the Admin directory listings and Reports exports to display only real unique records.
2. Build a serverless SMTP email invitation service directly within the existing Vercel project under `/api/send-email.ts`.

---

## Proposed Changes

### 1. Remove Duplicate Admin Records
We will filter database query results in JavaScript to guarantee only unique records are rendered and counted in case duplicate profiles or projects exist.

#### [MODIFY] [UserManagementView.tsx](file:///c:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/src/modules/Admin/views/UserManagementView.tsx)
- Filter `data` from profiles to only include unique records by email address before mapping to local state:
  `const uniqueData = data.filter((v, i, a) => a.findIndex(t => t.email === v.email) === i);`

#### [MODIFY] [ReportsView.tsx](file:///c:/fiverr%20projects/ananya%20gupta%2520project/pixel-perfect-marketing-main/src/modules/Admin/views/ReportsView.tsx)
- In `fetchCounts()`, select profiles/projects and count unique items using `Set`:
  - Unique students count by `email`
  - Unique faculty count by `email`
  - Unique projects count by `title`
- In `handleDownload()`, filter unique records by `email` (for students and faculty ledgers) and unique projects by `title` (for projects ledger) before exporting CSVs.

---

### 2. Vercel Serverless Email Service

#### [MODIFY] [package.json](file:///c:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/package.json)
- Add `"nodemailer"` as dependency.
- Add `"@types/nodemailer"` as devDependency.

#### [MODIFY] [vercel.json](file:///c:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/vercel.json)
- Add rewrite rule to direct `/api/(.*)` to `/api/$1` so Vercel can route function requests instead of redirecting all paths to `index.html`.

#### [NEW] [send-email.ts](file:///c:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/api/send-email.ts)
- Create a Vercel serverless function using Node runtime.
- Authenticate SMTP connection using environment credentials: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- Compose a premium styled HTML template invitation email containing login email, password, and active invitation link.
- Send the message using Nodemailer.

#### [MODIFY] [UserManagementView.tsx](file:///c:/fiverr%20projects/ananya%20gupta%20project/pixel-perfect-marketing-main/src/modules/Admin/views/UserManagementView.tsx)
- Add a new "Send Invitation Email" button to the signup success layout.
- Fetch `/api/send-email` using `POST` passing invitation details (`to`, `name`, `inviteLink`, `password`).
- Display loading indicators and trigger success toast notification once dispatched.

---

## Required Environment Variables
Set these variables inside Vercel Dashboard Settings or your local `.env`:
```env
# Platform Default SMTP (Nodemailer)
PLATFORM_SMTP_HOST=smtp.gmail.com
PLATFORM_SMTP_PORT=587
PLATFORM_SMTP_SECURE=false
PLATFORM_SMTP_USER=theboysofficialone@gmail.com
PLATFORM_SMTP_PASS=abqz caok ysee brug
PLATFORM_SENDER_EMAIL=theboysofficialone@gmail.com
PLATFORM_SENDER_NAME=SkillHunt
```

---

## Verification Plan

### Automated Tests
- Verify project compilation using `npm run lint` and `npm run build`.

### Manual Verification
- Verify that counts and CSV exports do not contain duplicate users or projects.
- Trigger the creation of a test faculty member and verify an invite email is delivered to the specified email box.
