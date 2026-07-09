# Skill Hunt — Project Showcase Portal

Skill Hunt is a premium, web-based platform designed for students to showcase their projects, faculty members to review and evaluate submissions, and the community to celebrate academic and technical excellence through rankings and leaderboards.

---

## 🚀 Key Features

- **Role-Based Dashboards**: Customized interfaces and workflows for three user types:
  - **Students**: Upload, edit, and manage projects. Link repository, demo videos, and live demos.
  - **Faculty**: Systematically evaluate student projects with scoring rubrics and feedback loops.
  - **Administrators**: Manage student/faculty activations, control project categories, and oversee portal settings.
- **Project Leaderboard**: An interactive ranking system to celebrate high-scoring projects.
- **Robust Authentication**: Email/password authentication, password recovery, and secure activation flows powered by Supabase Auth.
- **Client-Side Routing**: Smooth navigation with `react-router-dom` and role protection.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 (Vite + TypeScript)
- **Styling**: Tailwind CSS & shadcn/ui components
- **State Management & Data Fetching**: TanStack React Query (`@tanstack/react-query`)
- **Backend / Database**: Supabase (PostgreSQL database, Auth, Storage)
- **Icons & Motion**: Lucide React & Framer Motion

---

## ⚙️ Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) project

### Local Environment Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/kishoremk05/skill.hunt.git
   cd skill.hunt
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate it with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

3. **Install Dependencies**:
   ```sh
   npm install
   ```

4. **Start Development Server**:
   ```sh
   npm run dev
   ```
   Open your browser to the URL printed in the terminal (usually `http://localhost:8080`).

---

## 🧪 Development and Testing

- **Linting & Code Quality**:
  ```sh
  npm run lint
  ```
- **Run Unit/Integration Tests**:
  ```sh
  npm run test
  ```

---

## 📦 Deployment Guide

### 1. Pushing to GitHub

Use the following commands to initialize and push your project to your GitHub repository:

```sh
# Initialize Git repository
git init

# Add all files to staging
git add .

# Commit changes
git commit -m "first commit: add project with GitHub & Vercel deployment configs"

# Set default branch to main
git branch -M main

# Link remote origin
git remote add origin https://github.com/kishoremk05/skill.hunt.git

# Push to GitHub
git push -u origin main
```

### 2. Deploying to Vercel

This project is fully configured for Vercel deployment (supporting client-side routing rewrites via `vercel.json` and CI workflows via GitHub Actions).

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **New Project** and import the `skill.hunt` repository from GitHub.
3. In the **Configure Project** step:
   - Ensure the Framework Preset is set to **Vite** (Vercel automatically detects this).
   - Expand the **Environment Variables** section and add the following:
      - `VITE_SUPABASE_URL` (Value from your `.env` file)
      - `VITE_SUPABASE_ANON_KEY` (Value from your `.env` file)
      - `VITE_SUPABASE_PUBLISHABLE_KEY` (Value from your `.env` file)
      - `SUPABASE_SERVICE_ROLE_KEY` (Your Supabase service role key secret)
4. Click **Deploy**. Vercel will build the project and serve it.
5. Client-side routing is handled seamlessly by our custom `vercel.json` file.
6. The automated live preview checker is configured via Vercel Cron jobs and runs every 6 hours hitting `/api/cron-health-check`. You can also test check a specific project manually by making a request to `/api/cron-health-check?projectId=<id>`.

### 3. Deploying with Docker

The project includes a multi-stage `Dockerfile` and `nginx.conf` for production deployments.

1. Build the Docker image:
   ```sh
   docker build -t skill-hunt-app .
   ```
2. Run the container on port 8080:
   ```sh
   docker run -d -p 8080:80 skill-hunt-app
   ```
3. Your application is now running at `http://localhost:8080`.

### Database Setup

Run the migrations sequentially in your Supabase SQL editor to create the necessary tables, default rules, and Row Level Security policies. The migrations are stored in the `supabase/migrations` directory.

