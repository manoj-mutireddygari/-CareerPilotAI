# CareerPilot AI

CareerPilot AI is an AI-powered career automation platform that helps job seekers reduce repetitive job-search work. Users upload a resume, save one or more automation configurations, and run an autonomous workflow that searches recent job postings, matches jobs against the candidate profile, generates ATS keyword guidance, sends email recommendations, and stores run logs.

## Problem Statement

Students and job seekers often repeat the same workflow every day: searching job portals, reading job descriptions, checking eligibility, editing resumes for ATS keywords, and tracking applications manually. CareerPilot AI turns this repeated process into a configurable AI agent workflow.

## Features

- Firebase Authentication for user login and registration.
- Resume PDF upload and parsing with `pdf-parse`.
- Resume profile extraction into structured skill, technology, project, education, and role signals.
- Multiple saved automation configurations per user.
- Edit, delete, and select saved automations.
- Google Jobs collection through SerpAPI.
- 24-hour freshness filtering where job posting age is available.
- Job matching using AI when available and deterministic scoring fallback when AI is rate-limited.
- Duplicate prevention so already saved or emailed jobs are not reprocessed.
- ATS keyword guide generation instead of fake resume files.
- Email delivery through Gmail SMTP using Nodemailer.
- Firestore storage for users, automation settings, jobs, matched jobs, resume versions, emails, and automation logs.
- Live n8n-style automation pipeline popup.
- Premium responsive UI with glassmorphism, GSAP animations, Lenis smooth scroll, React Flow, and dashboard charts.

## Tech Stack

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- GSAP
- Lenis
- Framer Motion
- React Flow
- Recharts
- Lucide Icons
- React Router

Backend:
- Node.js
- Express
- Firebase Admin
- Firestore
- Firebase Storage-ready architecture
- SerpAPI
- OpenAI-compatible AI service
- Nodemailer
- node-cron
- pdf-parse

## Project Structure

```text
CareerPilot/
├── server/
│   ├── lib/
│   ├── routes/
│   ├── scheduler/
│   ├── services/
│   └── types.ts
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   └── types/
├── .env.example
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## Database Design

Firestore collections used by the application:

- `users`: parsed resume profile and user-level data.
- `automation_settings`: saved automation configurations.
- `jobs`: collected job postings.
- `matched_jobs`: jobs matched to a user profile.
- `resume_versions`: generated ATS keyword guidance documents.
- `automation_logs`: run history and workflow metrics.
- `emails`: email recommendation records.

## Automation Workflow

1. User uploads a resume PDF.
2. Backend extracts resume text.
3. AI analyzes resume signals, with fallback extraction if AI is unavailable.
4. User saves automation preferences such as roles, locations, salary, experience, time, and recipient email.
5. User selects a saved automation.
6. Dashboard Run button starts the selected workflow.
7. SerpAPI collects recent Google Jobs results.
8. The system removes jobs already processed for the user.
9. Remaining jobs are scored against the resume profile.
10. All jobs with score `>= 80` are saved as matched jobs.
11. ATS keyword guidance is generated for each match.
12. Email recommendations are sent through Gmail SMTP.
13. Logs and artifacts are saved to Firestore.

## Environment Variables

Create a `.env` file using `.env.example`.

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

PORT=8080
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
OPENAI_API_KEY=
SERPAPI_KEY=
SMTP_EMAIL=
SMTP_APP_PASSWORD=
DEFAULT_RECIPIENT_EMAIL=
DEFAULT_JOB_DOMAINS=AI Engineer,Full Stack Developer
DEFAULT_JOB_LOCATIONS=Remote
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run server
```

Start the frontend:

```bash
npm run dev -- --host 0.0.0.0 --port 5174
```

Open:

```text
http://localhost:5174
```

Backend health check:

```text
http://localhost:8080/api/health
```

## Build

```bash
npm run build
```

## Evaluation Highlights

Problem selection:
CareerPilot AI solves a repetitive and practical job-search problem faced by students and early-career candidates.

Workspace organization:
The project separates frontend pages/components, shared contexts, API utilities, backend routes, services, scheduler logic, and Firestore integration.

Database design:
Firestore collections are organized around users, automation settings, job data, matched jobs, generated guidance, logs, and emails.

Feature exploration:
The app includes resume parsing, saved automations, live workflow execution, job search, matching, duplicate prevention, email delivery, and logs.

Creativity and UI:
The landing page and dashboard use premium visuals, glassmorphism, animated workflow diagrams, live execution popups, charts, and responsive layouts.

AI usage:
AI is used for resume understanding, job matching, and ATS keyword guidance. Deterministic fallbacks keep the workflow usable during AI rate limits.

Documentation:
This README explains setup, structure, database design, workflow, and evaluation-relevant implementation details.

## Notes

- The current MVP sends ATS keyword guide `.txt` files, not generated PDF resumes.
- OpenAI rate limits are handled gracefully with deterministic fallback scoring and keyword guidance.
- Saved automations can be reused from the dashboard Run button.
