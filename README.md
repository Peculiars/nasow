This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin Dashboard

This project includes a built-in Admin Dashboard for managing core application data such as courses, quizzes, and student records. The Admin Dashboard is implemented as part of the Next.js app under the `src/app/admin` route and is intended for use by authenticated administrators.

- **Overview:** The admin area provides a central UI for creating, editing, and deleting courses and quizzes, managing student profiles and statuses, uploading media assets, and viewing quiz analytics and leaderboards.

- **Key features:**
	- Manage courses: create course skeletons, add weeks/content, and review course details.
	- Manage quizzes: create and edit quizzes and questions, launch and archive quizzes.
	- Student management: view students, complete profiles, sync records, and update profile status.
	- Media uploads: upload images and other assets used by courses/lecturers via a server-side upload endpoint.
	- Analytics & results: view quiz results, analytics, and leaderboard information for assessment and reporting.

- **Where to find code:**
	- Admin pages and UI: `src/app/admin` (contains `layout.tsx`, `page.tsx` and sub-pages for `courses`, `quizzes`, and `students`).
	- Admin UI components: `src/features/admin` (sidebar and per-feature UI components like course steps and week cards).
	- API routes for admin operations: `src/app/api/admin` (endpoints for `courses`, `students`, and `upload`).
	- Quiz-related APIs and analytics: `src/app/api/quiz-results` and `src/app/api/quizzes` (routes for results, analytics, and leaderboard).
	- Authentication helper: `src/lib/auth.ts` (used to protect admin routes and actions).
	- Upload and cloudinary helpers: `src/lib/cloudinary` (config and upload utilities used by the admin upload endpoint).
	- Database models and connection: `src/lib/mongodb` (connection helper and Mongoose/ODM models used across admin APIs).

- **How to access:**
	- Run the dev server with `npm run dev` and navigate to `/admin` when signed in as an administrator.
	- Admin pages expect authenticated sessions; the project uses the auth utilities found in `src/lib/auth.ts` and a Kinde-based flow in `src/app/(auth)` to handle sign-in and onboarding.

- **Important API endpoints (examples):**
	- `POST /api/admin/courses` — create a course (server-side handler in `src/app/api/admin/courses`).
	- `GET /api/admin/courses` — list courses.
	- `POST /api/admin/upload` — upload assets (server-side handler in `src/app/api/admin/upload`).
	- `GET /api/quiz-results/analytics` — fetch quiz analytics and aggregated results.

- **Developing & extending the admin area:**
	- UI components for admin features live in `src/features/admin` and are intended to be composable across the admin pages.
	- Follow existing patterns for server components vs. client components in the `app/` folder: use server components for data fetching and client components for interactive UI (forms, file inputs, toasts).
	- Use `src/lib/mongodb` models when adding new admin-backed endpoints to ensure consistent database behavior.

- **Security & permissions:**
	- Ensure admin API routes check the authenticated user's role before performing sensitive operations.
	- Validate and sanitize uploaded files on the server (the upload endpoint currently integrates Cloudinary helpers in `src/lib/cloudinary`).

If you want, I can add a short developer guide with code examples for adding new admin endpoints or wire up Role-Based Access Control (RBAC) for the admin area.
