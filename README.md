# TaskWave

**TaskWave** è una web app di **project management Kanban** pensata per **team di sviluppo, startup e PM tecnici** che vogliono coordinare il lavoro senza la complessità dei tool enterprise tradizionali.

In una frase: *gestisci workspace, board e task con drag-and-drop, aggiornamenti in tempo reale e notifiche mirate — partendo gratis e scalando solo quando serve.*

**Live:** [taskwave-rust.vercel.app](https://taskwave-rust.vercel.app)

---

## A cosa serve

TaskWave risolve un problema concreto: **far sapere a tutto il team cosa fare, in che stato si trova e chi se ne occupa**, senza stand-up lunghi, fogli Excel o chat infinite.

È utile quando:

- Un team dev lavora su più progetti in parallelo e ha bisogno di **board separate per ogni iniziativa**
- Serve **visibilità immediata** su backlog, work in progress e done (metodologia Kanban/Scrum leggera)
- Più persone modificano la stessa board e devono vedere i cambiamenti **senza refresh** (sync realtime)
- Il PM o il tech lead vuole **assegnare task**, commentare, impostare scadenze e ricevere **notifiche** su assegnazioni e spostamenti
- Un team in crescita vuole **invitare membri via email**, gestire ruoli (admin/member) e, in futuro, **integrare CI/CD o Slack** via webhook/API (piano Business)

TaskWave **non** è un sostituto di Jira per workflow enterprise complessi con centinaia di campi custom obbligatori. È un tool **veloce, opinionato e keyboard-friendly** per team che preferiscono shipping a configurazione infinita.

---

## Cosa puoi fare (funzionalità principali)

### Workspace e organizzazione

- **Workspace multipli** — separa clienti, prodotti o squadre; ogni workspace ha membri, board e impostazioni proprie
- **Ruoli** — `admin` (gestione team, inviti, impostazioni) e `member` (lavoro sulle board)
- **Inviti** — aggiunta membri via email (Pro+) con flusso accept/decline e link `/invite/[token]`
- **Limiti per piano** — enforcement lato database (RLS): es. piano Free = max 3 board per workspace

### Board Kanban

- **Colonne personalizzabili** (Pro+) o template predefiniti (Kanban classico, Scrum, bug tracker)
- **Drag-and-drop** — sposta task tra colonne con feedback visivo immediato
- **Filtri** — per priorità (alta/media/bassa) e assignee
- **Viste** — board classica + timeline attività
- **Presence** — indicatore “N persone online” sulla board (Supabase Presence)
- **Template board** — creazione rapida da modelli preconfigurati
- **Guest link** (Business) — condivisione read-only della board con link tokenizzato e scadenza

### Task

- Titolo, descrizione, **priorità**, **scadenza** (Pro+), **assignee**
- **Commenti** thread (Pro+) con notifiche
- **Allegati** file su task (Pro: 25 MB, Business: 100 MB)
- **Custom fields** per workspace (Business) — campi testo/numero/select gestiti da admin
- Spostamento tra colonne con eventi tracciati (audit, webhook, notifiche)

### Collaborazione e notifiche

- **Sync realtime** — Supabase Realtime: modifiche visibili a tutti i client connessi sulla stessa board
- **Inbox notifiche** — assegnazioni, commenti, spostamenti task
- **Email opzionali** (Resend) — toggle per tipo di evento nelle impostazioni account
- **Activity feed** — cronologia azioni recenti nel workspace

### Produttività

- **Command palette** (`⌘K` / `Ctrl+K`) — navigazione rapida e azioni
- **Onboarding guidato** — wizard al primo accesso per creare workspace e board
- **PWA** — installabile come app, manifest e service worker base
- **Tema** — dark/light/system + accent color workspace (Pro+)

### Business e integrazioni (piano Business)

- **REST API v1** — workspace, board, task, membri (autenticazione Bearer API key)
- **API keys** — generazione/revoca per workspace
- **Webhook outbound** — eventi task (assign, move, comment) verso URL configurabili con firma HMAC
- **Audit log** — registro azioni critiche + export
- **SSO/SAML** — placeholder/configurazione su richiesta (`/api/sso/status`)

Documentazione API integrata: [`/docs`](https://taskwave-rust.vercel.app/docs)

### Privacy, compliance e sicurezza

TaskWave tratta privacy come feature di prodotto, non come afterthought:

- **Opt-out IP end-to-end** — pagina pubblica `/privacy/opt-out`, toggle in account, supporto GPC/DNT; IP mai salvato in chiaro (solo hash SHA-256 + salt)
- **Cookie consent banner** — categorie necessari vs analytics/marketing
- **Diritti GDPR** — export JSON account, cancellazione account, preferenze privacy
- **2FA TOTP** — configurabile da Impostazioni → Sicurezza (Supabase MFA)
- **Rate limiting** — su invite, opt-out, delete account, form contatto
- **CSP** e header di sicurezza in `next.config.mjs`
- **RLS PostgreSQL** — ogni riga protetta per utente/workspace; limiti piano enforced server-side

### Sito marketing

- Landing, **About**, **Funzionalità**, **Prezzi** (stile Apple, animazioni Framer Motion)
- **Blog** MDX da `content/blog/`
- **Form Contattaci** in header → Resend (`POST /api/contact`)
- Pagine legali: Privacy, Termini, Opt-out IP

### Pagamenti (Stripe)

Tre piani con funzionalità progressive:

| Piano | Prezzo | Per chi |
|-------|--------|---------|
| **Free** | €0 | Side project, piccoli team (3 workspace, 5 membri, 3 board/ws) |
| **Pro** | €12/mo | Team in crescita — inviti, scadenze, commenti, allegati, analytics, CSV |
| **Business** | €29/mo | Integrazioni — API, webhook, audit, guest link, custom fields, SSO |

Checkout Stripe (test mode in dev), portale fatturazione, sync piano via webhook.

---

## Architettura

```
Browser (Next.js 14 App Router)
    │
    ├── Pagine marketing (/, /about, /features, /pricing, /blog)
    ├── Dashboard autenticata (/dashboard, /workspace/.../board/...)
    └── API Routes (/api/*)
            │
            ├── Supabase Auth (session cookie SSR)
            ├── PostgreSQL + RLS (dati, RPC, trigger)
            ├── Supabase Realtime + Presence (board live)
            ├── Supabase Storage (allegati)
            ├── Stripe (checkout, webhook, portal)
            └── Resend (email transazionali, contatto, inviti, opt-out)
```

**Stack tecnico:**

| Layer | Tecnologia |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind, shadcn/ui, Framer Motion |
| Auth & DB | Supabase (PostgreSQL, RLS, Auth, Realtime) |
| Pagamenti | Stripe Checkout + Customer Portal |
| Email | Resend |
| Deploy | Vercel |
| E2E | Playwright |

**Backend legacy:** la cartella `backend/` (Django) è **deprecata** e non usata in produzione. Tutta la logica vive in Next.js API Routes + RPC Postgres. Vedi [`backend/DEPRECATED.md`](backend/DEPRECATED.md).

---

## Struttura repository

```
src/
├── app/                    # App Router (pagine + API routes)
│   ├── (dashboard)/        # Area autenticata (dashboard, board, docs)
│   ├── (auth)/               # Login, register, reset password
│   ├── api/                  # REST interno + v1 Business + Stripe + privacy
│   ├── about/ features/ pricing/ blog/  # Marketing
│   └── privacy/ terms/       # Legal
├── components/               # UI, layout, workspace panels, marketing
├── hooks/                    # Realtime, presence
├── lib/                      # Supabase client, data layer, plans, privacy, email
content/blog/                 # Articoli MDX/markdown
supabase/migrations/          # Schema SQL versionato (001–014)
docs/                         # BACKUP.md, MONITORING.md
e2e/                          # Test Playwright
```

---

## Setup locale

### 1. Dipendenze

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
# Compila: Supabase URL/keys, Stripe, Resend, PRIVACY_IP_SALT, ecc.
```

Variabili principali: vedi [`.env.example`](.env.example).

### 3. Supabase

Progetto attivo: `lcubcugivegahjsbmepy` (eu-west-1)

1. Dashboard: https://supabase.com/dashboard/project/lcubcugivegahjsbmepy
2. Applica migrazioni in `supabase/migrations/` (001 → 014)
3. **Auth → URL Configuration:**
   - Site URL: `https://taskwave.vercel.app` (o il tuo dominio)
   - Redirect: `https://<dominio>/auth/callback`, `http://localhost:3000/auth/callback`

### 4. Stripe (test mode)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Carta test: `4242 4242 4242 4242`.

### 5. Avvia

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

---

## Deploy

Progetto Vercel: **`taskwave`**

```bash
vercel deploy --prod
```

**URL produzione:** https://taskwave-rust.vercel.app

Per usare `taskwave.vercel.app`: Vercel Dashboard → progetto **taskwave** → Settings → Domains → assegna il dominio alla production corrente (rimuovi eventuali alias su deploy obsoleti).

Dopo il deploy, aggiorna:

- `NEXT_PUBLIC_APP_URL` su Vercel
- Supabase Auth URLs
- Webhook Stripe → `https://<dominio>/api/stripe/webhook`

---

## Test

```bash
npm run test:e2e          # Playwright — landing, pricing, opt-out, auth redirect
npx playwright install    # primo utilizzo
```

---

## Sicurezza e operazioni

- Rate limiting in-memory su route sensibili
- CSP + security headers
- 2FA TOTP in impostazioni account
- [`docs/MONITORING.md`](docs/MONITORING.md) — health check, Sentry opzionale
- [`docs/BACKUP.md`](docs/BACKUP.md) — backup Supabase, runbook ripristino

---

## Licenza e contatti

Progetto privato / uso interno — vedi repository GitHub per dettagli.

- Sito: [taskwave-rust.vercel.app](https://taskwave-rust.vercel.app)
- Contatto: form “Contattaci” sul sito o `hello@taskwave.app`
