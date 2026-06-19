# TaskFlow Pro

Task management Kanban per team di sviluppo. Next.js 14 + Supabase + Stripe (test mode), deployato su Vercel.

## Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **Payments**: Stripe Checkout (test mode)
- **Deploy**: Vercel

## Setup locale

### 1. Dipendenze

```bash
npm install
```

### 2. Supabase

Progetto attivo: `lcubcugivegahjsbmepy` (eu-west-1)

1. Dashboard: https://supabase.com/dashboard/project/lcubcugivegahjsbmepy
2. Schema già applicato via migrazione `initial_schema`
3. **Auth → URL Configuration** — aggiungi:
   - Site URL: `https://taskflow-pro-niccolopicciolis-projects.vercel.app`
   - Redirect URLs: `https://taskflow-pro-niccolopicciolis-projects.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`
4. Disabilita "Confirm email" in sviluppo se vuoi login immediato

### 3. Stripe (test mode)

Prodotti creati: **Pro** €12/mese, **Business** €29/mese

Price IDs configurati in Vercel env vars.

Per webhook locale:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Environment

```bash
cp .env.example .env.local
# Compila tutte le variabili
```

### 5. Avvia

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Deploy Vercel

**Live:** https://taskflow-pro-niccolopicciolis-projects.vercel.app

Progetto Vercel: `taskflow-pro` (team niccolopicciolis-projects)

1. Env vars già configurate su Vercel
2. Webhook Stripe punta a `https://taskflow-pro-niccolopicciolis-projects.vercel.app/api/stripe/webhook`
3. Per redeploy: `vercel deploy --prod`

## Test pagamenti

Usa la carta test `4242 4242 4242 4242`, qualsiasi data futura e CVC.

## Struttura

```
src/
├── app/              # Next.js App Router
├── components/       # UI + layout condivisi
├── lib/
│   ├── supabase/     # Client Supabase
│   ├── data/         # Data access layer
│   └── stripe.ts     # Stripe config
supabase/
└── migrations/       # Schema SQL
```

## Backend legacy

La cartella `backend/` contiene il vecchio backend Django. Non è usato in produzione — l'app usa Supabase.
