# Mrs India

Public marketing and applicant-registration site for the Mrs India pageant
(Season 01, finale 28 — 31 October 2026 in Goa).

## Tech stack

- **Next.js 16** (App Router, TypeScript strict, Turbopack)
- **Tailwind CSS v4**
- **MongoDB Atlas** via **Mongoose**
- **sharp** for server-side image resize + JPEG re-encode; photos are stored
  inline in the application document as base64 data URLs (no third-party
  storage)

## Project layout

```
src/
  app/
    layout.tsx                  # root layout, fonts, global styles
    globals.css                 # Tailwind v4 + design tokens
    (public)/
      page.tsx                  # landing page  →  /
      register/page.tsx         # 4-step applicant form  →  /register
      _components/
        Countdown.tsx           # live countdown to the finale
        Reveal.tsx              # scroll-reveal observer
    api/
      applications/route.ts     # POST: create an application
      upload/route.ts           # POST: validate, resize, base64-encode an image
  lib/mongodb.ts                # cached Mongoose connection
  models/Application.ts         # Application schema
```

## Routes

| Path                | Method | Purpose                                                   |
| ------------------- | ------ | --------------------------------------------------------- |
| `/`                 | GET    | Brand landing page with a **Register Now** CTA.           |
| `/register`         | GET    | Multi-step applicant form. Posts to `/api/applications`.  |
| `/api/applications` | POST   | Validates and persists a new application to MongoDB.      |
| `/api/upload`       | POST   | Accepts an image (JPG/PNG/WEBP, ≤5 MB), resizes to a max  |
|                     |        | dimension of 1200 px, returns a base64 JPEG data URL.     |

There is no public list endpoint — applicant data is not exposed by this site.

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill MONGODB_URI
npm run dev
```

Open <http://localhost:3000>.

## Environment

Only one variable is required:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?...
```

`src/lib/mongodb.ts` throws at startup if it is missing.

## Scripts

```bash
npm run dev     # dev server (Turbopack)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Notes

- Photos are stored as base64 data URLs directly on the `Application`
  document. This keeps the deployment dependency-free but inflates document
  size; the `sharp` pipeline caps the longest side at 1200 px and re-encodes
  at JPEG quality 75 to keep documents well under MongoDB's 16 MB limit.
- The "Submit Application" flow does **not** take online payment. The fee
  shown (INR 4,999) is informational; the team contacts applicants about
  payment after shortlisting.
