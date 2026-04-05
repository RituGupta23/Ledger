# Ledger

Ledger is a local-first personal finance dashboard built with Next.js.

It is designed as a practical demo app: quick to run, easy to inspect and focused on real-world money tracking workflows (overview, transactions and insights) without backend setup.

## What this app does

Ledger helps you:

- Track income and expenses in one timeline
- Compare monthly cash flow and running balance trends
- Spot unusual spending with simple alerts
- Filter and search transactions quickly
- Export filtered transaction data to CSV or JSON
- Test role-based behavior (`Viewer` vs `Admin`) in the UI

## Tech stack

- Next.js 16 (App Router)
- React 19
- Zustand (with persistence)
- Recharts
- Tailwind CSS v4
- Lucide icons

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Production build (optional)

```bash
npm run build
npm start
```

### 4. Lint

```bash
npm run lint
```

## Project approach

This project intentionally uses a **frontend-only architecture** with mocked data and browser persistence.

Why this approach:

- Keeps setup simple (no database, no API keys, no backend service)
- Makes UI/state behavior easy to review in isolation
- Lets you evaluate dashboard UX and component structure quickly

How data/state works:

- Initial transactions come from static mock data
- Global app state is managed with Zustand
- State is persisted in `localStorage` using Zustand `persist`
- Theme preference and role mode are persisted too
- `skipHydration` + client mount guards are used to avoid hydration mismatch in Next.js

## Feature walkthrough

### Dashboard (`/`)

- Summary cards for total balance, current month income and current month expenses
- Running balance trend chart across months
- Current month category breakdown chart
- Monthly income vs expense comparison chart
- Auto-notice when total balance is negative
- Alert when current month has a very large expense (threshold-based)

### Transactions (`/transactions`)

- Search by merchant name
- Filter by category, type, and month
- Sortable table behavior
- Export currently filtered data as CSV or JSON
- Add/Edit/Delete transactions (Admin mode)
- Read-only transaction view (Viewer mode)

### Insights (`/insights`)

- Top spending category this month
- Month-over-month category variance
- Spending alerts for key patterns, for example:
  - Single category dominating spend
  - Expenses exceeding income
  - Improved savings behavior
  - Significant month-over-month spikes or drops

## Roles and permissions

The app includes a simple in-app role toggle:

- Viewer: can browse, filter and export
- Admin: can add, edit and delete transactions

This is a UI/state-level role model for demo purposes (not auth/security).

## Data notes

- Mock dataset spans multiple recent months and includes income + expense activity
- Dates are generated relative to the current date so the demo remains relevant over time
- "Reset Demo Data" restores transactions to the original mock dataset

## Folder map (high level)

- `app/`: App Router pages (Dashboard, Transactions, Insights)
- `components/`: Reusable UI and chart components
- `store/`: Zustand global state
- `lib/`: Utilities and mock data

## Known limitations

- No real authentication or backend authorization
- No server-side persistence (data is browser-local)
- Export is client-side only
- Currency format is currently INR (`en-IN`)

## Future improvements

- Add real user authentication + protected API routes
- Persist transactions to a database
- Add budgets/goals and recurring transaction rules
- Add unit/integration tests for utils and key flows
- Add multi-currency and locale settings

## License

No license file is currently included. Add one if you plan to distribute or open-source this project.
