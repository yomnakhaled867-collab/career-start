# Career Start project context

## Project

Career Start is a university graduation project: a Graduate Support Platform for fresh graduates. The team has six members and a two-week deadline. The goal is a working, presentation-ready demo, not a production system. Keep implementation simple.

## Approved stack and constraints

- Keep the existing vanilla HTML, CSS, and JavaScript frontend. Do not migrate to Next.js.
- Split frontend files by feature so team members can work in parallel.
- Use Supabase for authentication and the database through `supabase-js` from a CDN. Client code may contain only the public anon key.
- Call Gemini only from a Vercel-format serverless function under `/api`; never call Gemini from client code.
- Store keys in environment variables. Keep `.env.local` and `.cph/` out of version control, and maintain `.env.example` when environment variables are introduced.
- Do not add build tools, frameworks, or libraries without project-owner approval.

## Folder conventions

- Keep `index.html` as the landing page and preserve its existing behavior during setup/refactoring.
- Put shared styles in `css/base.css` and `css/layout.css`; keep feature styles in their matching files under `css/`.
- Put shared browser behavior in `js/layout.js`; keep feature behavior in matching files under `js/`.
- Put feature pages in `pages/` and shared page-independent data in `/data` as JSON.
- Keep static media in `assets/`.
- Gemini and Supabase service-role keys belong only in server-side code; never expose them in client code.

## Working rules

- Edit only files belonging to your own feature. Change shared files (`css/base.css`, `css/layout.css`, `js/layout.js`, and `index.html`) only when necessary.
- Do not add libraries without approval.
- Always handle loading and error states for asynchronous interactions.
- Make small, focused commits with clear messages.
- Work on a feature branch; never make project changes directly on `main`.
- Explain changes after each task in 3–4 lines.
- Ask the project owner before making assumptions about missing requirements or behavior.
