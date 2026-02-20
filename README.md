# Mildav Frontend

React + TypeScript frontend for the Mildav project. Uses Vite, TanStack Router, TanStack Query, Zustand, and Tailwind CSS.

## Tech Stack

- **React 18** with TypeScript
- **Vite** — dev server and bundler
- **TanStack Router** — file-based routing
- **TanStack Query** — server state management
- **Zustand** — client state management
- **React Hook Form** + **Zod** — form handling and validation
- **Axios** — HTTP client
- **Tailwind CSS** — styling

## Prerequisites

- Node.js 18+
- npm
- Django backend running (see backend repo)

## Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repo-url>
   cd mildav-frontend
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your backend URL:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

## Development

Start the dev server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> The TanStack Router plugin automatically generates `src/routeTree.gen.ts` from files in `src/routes/` — do not edit that file manually.

## Type Checking

Run TypeScript type checking without emitting files:

```bash
npm run typecheck
```

## Production

### Build

Compile TypeScript and bundle for production:

```bash
npm run build
```

Output is placed in the `dist/` directory.

### Preview

Serve the production build locally to verify it before deploying:

```bash
npm run preview
```

The preview server runs at `http://localhost:4173`.

### Deploy

Upload the contents of `dist/` to your static hosting provider (Nginx, Caddy, S3, Vercel, etc.).

For Nginx, point the root to `dist/` and redirect all routes to `index.html` for client-side routing:

```nginx
server {
    listen 80;
    root /path/to/mildav-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Set `VITE_API_URL` to your production backend URL before building:

```bash
VITE_API_URL=https://api.yourdomain.com npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/        # Login and register forms
│   └── ui/          # Reusable UI components (Button, Input)
├── hooks/           # Custom React hooks
├── lib/             # Axios instance, React Query client
├── routes/          # File-based routes (TanStack Router)
├── schemas/         # Zod validation schemas
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
└── main.tsx         # App entry point
```
