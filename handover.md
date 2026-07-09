# Project Handover Documentation
## Skill Hunt - CS Project Showcase & Judging Platform

### Overview
Skill Hunt is a comprehensive project showcase and evaluation platform tailored for university computer science departments. It facilitates student submissions, faculty reviews, peer voting, and automated leaderboard generation.

### Architecture & Tech Stack
- **Frontend Framework**: React with Vite
- **Styling**: Tailwind CSS (with custom Glassmorphism/Premium dark and light themes)
- **Backend & Database**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Icons**: Lucide React
- **Deployment**: Docker & Nginx (Multi-stage build)

### Modules
1. **Student Module**: Submissions, viewing project timelines, peer voting (constrained by team/self rules).
2. **Faculty Module**: Evaluation rubric (30-char min feedback), scoring projects.
3. **Admin Module**: Leaderboard management (minimum 3 reviews requirement, 85/15 weighted scoring), event scheduling.

### Key Business Rules Implemented
- **Scoring Weights**: Default 85% Faculty / 15% Peer.
- **Leaderboard Visibility**: Requires minimum 3 faculty reviews to be ranked.
- **People's Choice Badge**: Awarded to the project with the highest peer votes.
- **External Sync**: GitHub repo metadata (stars, forks, primary language, commit count, and last commit date) are fetched and rendered. Live demo URL health is validated at submission and verified on a recurring daily interval via the `/api/cron-health-check` Vercel Serverless Function (restricted to once-per-day due to Vercel Hobby account limits; can be changed to 6 hours `0 */6 * * *` on a Pro plan).

### Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`) with the following variables:
- `VITE_SUPABASE_URL`: Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (used in serverless functions)
- `PLATFORM_SMTP_HOST` / `PLATFORM_SMTP_PORT` / `PLATFORM_SMTP_USER` / `PLATFORM_SMTP_PASS` / `PLATFORM_SENDER_EMAIL`: SMTP configurations for sending email invitations.

### Deployment Instructions
1. Install Docker on your server.
2. Build the image: `docker build -t skill-hunt-app .`
3. Run the container: `docker run -p 8080:80 skill-hunt-app`
4. For hosting on Vercel:
   - Connect the repository to Vercel.
   - Configure the environment variables in Vercel settings.
   - The cron health check will run automatically every 6 hours as defined in `vercel.json`.

