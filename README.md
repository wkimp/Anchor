# Anchor — Life Planner

A quiet, paper-planner-inspired life management app for desktop, tablet, and mobile.

## Quick start

```bash
cp .env.example .env.local  # add Supabase + Anthropic keys
npm install
npm run dev
```

Visit http://localhost:3000 — works in demo mode without any keys.

## Deploy on Vercel

This app is a full-stack Next.js project, so Vercel is the simplest production host.

### 1. Import the repo

- Push this repository to GitHub.
- In Vercel, choose `Add New Project`.
- Import the GitHub repo.
- Let Vercel auto-detect Next.js.

### 2. Set environment variables

Add these in Vercel for Production, Preview, and Development as needed:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

Set `NEXT_PUBLIC_SITE_URL` to your deployed app URL, for example:

```bash
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 3. Configure Supabase Auth

In Supabase:

- Set `Site URL` to your production app URL.
- Add redirect URLs for:
  - `https://your-app.vercel.app/auth/callback`
  - `https://your-preview-url.vercel.app/auth/callback` if you want preview auth to work
  - `http://localhost:3000/auth/callback` for local development

### 4. Deploy

Use the default Vercel settings:

- Install Command: `npm ci`
- Build Command: `npm run build`

The app also works in demo mode without any keys, but authentication, database features, and the AI agent need the corresponding environment variables.

## Setup details

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
