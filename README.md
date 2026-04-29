# Akash Portfolio (Next.js 16)

Modern single-page portfolio with admin dashboard APIs, MongoDB persistence, and animated sections.

## 1) Local Development

Install dependencies:

```bash
npm install
```

Environment setup:

1. `.env` is already included for local run in this workspace.
2. For a new machine, copy `.env.example` to `.env` and fill values.

Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## 2) Required Environment Variables

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## 3) Vercel Deployment (Direct Env Import)

Use the root `.env` file directly in Vercel:

1. Go to Vercel Project -> Settings -> Environment Variables.
2. Click `Import .env`.
3. Upload the `.env` file from project root.
4. Select environments (`Production`, `Preview`, `Development`) and save.
5. Redeploy.

## 4) Build and Start

```bash
npm run build
npm run start
```

## 5) Utility Scripts

Scripts in `scripts/` now resolve `MONGODB_URI` in this order:

1. `process.env.MONGODB_URI`
2. `.env`
3. `.env.local`

So the same project works for local development and Vercel with minimal changes.
