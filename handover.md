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
- **External Sync**: GitHub repo metadata (stars, forks) and live demo URL health check (no-cors) are fetched on the client side.

### Deployment Instructions
1. Install Docker on your server.
2. Build the image: `docker build -t skill-hunt-app .`
3. Run the container: `docker run -p 8080:80 skill-hunt-app`
4. Make sure to configure the Supabase URL and ANON KEY in `.env.local` before building, or pass them as build args if refactored.
