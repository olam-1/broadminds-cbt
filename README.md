# Broadminds School Website + CBT Starter (Free Hosting Ready)

This is a starter project you can run locally and deploy for free:
- Frontend: Next.js (App Router)
- Backend: Supabase (Postgres + Auth)

## 1) Requirements
- Install Node.js (LTS)
- Create accounts:
  - GitHub
  - Supabase
  - Vercel (or Netlify)

## 2) Setup (Local)
1. Copy env file:
   - Duplicate `.env.example` -> `.env.local`
2. Fill env values from Supabase project settings:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server-only)

3. Install dependencies:
   npm install

4. Run dev server:
   npm run dev

Open http://localhost:3000

## 3) Setup Supabase (Database)
In Supabase SQL Editor, run:
1) broadminds_schema.sql
2) broadminds_seed.sql
3) broadminds_admin_seed.sql
4) broadminds_automations.sql

(These files are in your earlier downloads from ChatGPT.)

## 4) Deploy FREE (Vercel)
1. Push this folder to GitHub.
2. In Vercel: New Project -> Import GitHub repo -> Deploy.
3. Add Environment Variables in Vercel project settings:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
4. Redeploy.

## What works in this starter
- Public pages (Home/About/Admissions/Contact)
- CBT: Start by Exam Code -> timer -> answer saving -> submit -> result page

## Next steps to make it production
- Add role-based Admin dashboard (create banks, upload questions)
- Enable RLS policies in Supabase (security)
- Add payments & fee tracking UI

