# Career Start

Career Start is a university graduation project: a graduate support platform for fresh graduates. It brings together career direction guidance, learning roadmaps, CV resources and analysis, and interview preparation. The goal is a working, presentation-ready demo built with a small, straightforward stack.

## Project structure

```text
.
├── index.html              # Landing page
├── pages/                  # Feature pages
├── css/                    # Shared and feature-specific styles
├── js/                     # Shared and feature-specific browser behavior
├── assets/                 # Images, video, and other static media
├── data/                   # Shared page-independent JSON data (add as needed)
├── api/                    # Vercel serverless functions (add as needed)
├── .env.example            # Environment variable names and placeholders
└── AGENTS.md               # Project conventions and working rules
```

Keep shared styles in `css/base.css` and `css/layout.css`, shared browser behavior in `js/layout.js`, and feature code in its matching files. Keep `index.html` as the landing page. Put Gemini calls only in Vercel serverless functions under `api/`.

## Run locally

For the static site, run a local HTTP server from the repository root:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Serving over HTTP keeps relative paths working; opening `index.html` directly as a file may not.

To exercise Vercel serverless functions locally, install/use the Vercel CLI and run `vercel dev` from the repository root. Add local values to `.env.local` as needed. Start from `.env.example`; never commit `.env.local`. `SUPABASE_ANON_KEY` is the public client key and may be used in browser code. Keep `GEMINI_API_KEY` and any Supabase service-role key server-side only.

## Deploy to Vercel

1. Push the feature branch and open a pull request into `main`.
2. After review and merge, import the Git repository in Vercel (or connect the existing Vercel project) and set the project root to the repository root.
3. Select the **Other** framework preset. This is a static HTML/CSS/JS project with Vercel functions under `api/`; it does not need a build command or output directory.
4. Add the required environment variables in the Vercel project settings for the appropriate environments. Use `.env.example` as the variable-name reference. Keep Gemini and service-role secrets server-side; never put them in client code.
5. Deploy from `main`, then open the generated deployment URL and check the landing page, feature-page navigation, and any configured API flow.

## Branching and reviews

- Create a branch for each piece of work using `feature/<name>` (or a clearly scoped `chore/<name>` branch for project setup work).
- Make focused commits on the branch; do not work directly on `main`.
- Open a pull request from the branch into `main` when the deliverable is ready.
- One review is required before merging into `main`.

## Revised teammate task list

Each owner should keep changes within their assigned files and coordinate shared-file edits before changing them. The six tasks below cover one owner each.

| Owner | Files they own | Deliverable | Done criteria |
| --- | --- | --- | --- |
| Auth/layout | `js/auth.js`, `js/layout.js`, `css/layout.css`, `css/base.css`, shared navigation markup in `index.html` and `pages/*.html` | Shared navigation/layout and Supabase sign-in/sign-up experience | Navigation works across landing and feature pages; auth uses `supabase-js` from a CDN and only the anon key in the browser; loading, success, and error states are visible; shared styles remain consistent. |
| Quiz | `pages/quiz.html`, `js/quiz.js`, `css/quiz.css` | Career-interest quiz and recommendation results | User can submit the quiz and see a recommendation; input validation and empty/error states are handled; the page links correctly to the relevant roadmap. |
| Roadmaps | `pages/roadmaps.html`, `js/roadmaps.js`, `css/roadmaps.css`, `data/roadmaps.json` | Browsable learning roadmaps for the supported career paths | Roadmap content is loaded from shared JSON; paths are readable and navigable; missing or failed data shows a useful message. |
| CV analyzer + serverless endpoint | `pages/cv-analyzer.html`, `js/cv-analyzer.js`, `css/cv-analyzer.css`, `api/analyze-cv.js` (or another agreed endpoint filename) | CV analysis flow backed by a Vercel function calling Gemini | Browser sends requests only to the project endpoint; Gemini key stays in server environment; endpoint validates input and returns useful errors; UI shows loading and failure states. |
| Interview | `pages/interview.html`, `js/interview.js`, `css/interview.css` | Interview preparation page with usable question categories and practice flow | Category controls and practice interactions work on desktop and mobile; content is understandable; empty/loading/error states are handled for any asynchronous behavior. |
| CV guide + demo integration | `pages/cv-guide.html`, `js/cv-guide.js`, `css/cv-guide.css`; coordinate integration edits to `index.html` and shared navigation | CV writing guide plus a coherent end-to-end demo linking all features | Guide is complete and navigable; landing page links to each feature; links/assets resolve; demo flow is presentation-ready and integrated changes are reviewed with shared-file owners. |

