# 🏠 Roomier

## Product Vision Statement
Roomier is a mobile web application designed to make shared living smoother, fairer, and less stressful by providing a centralized platform for roommates to coordinate chores, split expenses, track shared inventory, and maintain a harmonious living environment.

## Core Team Members
- [Lina Sanchez](https://github.com/linahsan)
- [Luna Suzuki](https://github.com/lunasuzuki)
- [Sunil Parab](https://github.com/SunilParab)
- [Shritha Gundapuneni](https://github.com/shrithag)
- [Cyryl Zhang](https://github.com/nstraightbeam)

---

## Project Overview

### What and Why?
Living with roommates comes with everyday challenges that create unnecessary friction:
- Whose turn is it to take out the trash?
- Who owes money for utilities and groceries?
- Who finished the milk without buying more?
- Why is it so loud when someone is trying to sleep?

**Roomier** solves these problems by offering a centralized hub where roommates can coordinate chores, split expenses, track shared items, and maintain group harmony through simple preferences and clear responsibilities.

### For Whom?
- College students living in dorms or shared apartments  
- Students adjusting to co-living  
- Young professionals sharing apartments in cities

---

## Key Features

### 🔐 Authentication (mocked for now)
- Login / Signup screens (front-end with mocked back-end endpoints)
- Profile page with basic user info stored locally

### 👥 Group Management
- Create/join groups with invite codes
- Edit group details, description, and roommates
- Mobile-first UI with clean, consistent styling

### 📋 Chore Scheduler (Sprint 1 UI, Sprint 2 API stubs)
- Assign and rotate tasks with due dates
- Dashboard list shows what's due

### 💰 Expense Splitter (Sprint 1 UI, Sprint 2 API stubs)
- Log shared expenses and see "You owe / You're owed" summary

### 📦 Inventory Tracker
- Household item list with status (Low / Good / Full)

### 🌡️ Preferences
- Quiet hours
- Temperature (°F)
- Guests allowed / not allowed

---

## Architecture

- **Front-end:** React (function components + JSX), client-side routing
- **Back-end:** Express.js with mock JSON responses (in-memory store)
- **Testing:** Mocha + **Chai** + Supertest; **c8** for coverage
- **State/Integration:** Front-end fetches data from Express API (`/api/*`)
- **No secrets in git:** Use `.env` files (not committed)

---

## API Overview (Sprint 2)

Base URL: `http://localhost:4000/api`

- `GET  /health` → `{ ok: true }`
- `GET  /groups` → list groups
- `POST /groups` → create group (accepts `{ name, roommates, components, preferences, quietHours }`)
- `GET  /groups/:id` → group details
- `PUT  /groups/:id` → update group
- `GET  /groups/:id/dashboard` → aggregate `{ group, prefs, roommates, chores, expenses, inventory }`
- `GET  /groups/:id/prefs` → preferences
- `PUT  /groups/:id/prefs` → update preferences
- `POST /login` / `POST /signup` → mocked responses

Static:
- `GET /public/ping.txt` → `ok`

> Data is stored in an **in-memory** mock store and will reset when the server restarts.

---

## Getting Started

### Prerequisites
- Node.js **18+**
- npm

### 1) Back-end (Express)
```bash
cd back-end
npm install
cp .env.example .env     # edit if needed
npm run dev              # starts http://localhost:4000
```

**`back-end/.env.example`**
```
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### 2) Front-end (React)
```bash
cd front-end
npm install
cp .env.example .env     # ensures FE points to the API
npm start                # opens http://localhost:3000
```

**`front-end/.env.example`**
```
REACT_APP_API_URL=http://localhost:4000/api
```

> Run both servers in separate terminals during development.

---

## Front-end Routes (current)

* `/login`, `/signup`, `/profile`
* `/dashboard`
* `/groups/new` (Create Group)
* `/groups/:groupId/edit` (Edit Group)
* `/groups/:groupId/inventory`
* `/chores`, `/add-chore`, `/chores/:choreId/edit`
* `/expenses`, `/expenses/new`, `/expenses/:expenseId/edit`

---

## Testing & Coverage (Back-end)

Run all tests:
```bash
cd back-end
npm test
```

Project coverage (enforces ≥10% across branches/functions/lines/statements):
```bash
npm run coverage
```

Per-member coverage:
```bash
npm run coverage:cyryl
npm run coverage:luna
npm run coverage:lina
npm run coverage:sunil
npm run coverage:shritha
```

> Tests use **Mocha** + **Chai** + **Supertest**; coverage is computed by **c8**.
> Per-member specs live under `back-end/test/<member>/**/*.spec.js`.

---

## Development Workflow

* **Feature Branch Workflow**
  * Create a branch per feature: `feat/<area>-<short-description>`
  * Open a Pull Request to `master`
  * Resolve conflicts via merge commits (no rebase required by course rules)
* Keep commits small and meaningful; reference the feature/issue in the message.

---

## Project History

* Prototyping in Figma
* **Sprint 0:** UX design and clickable prototype
* **Sprint 1:** Front-end screens, routing, mock data on the client
* **Sprint 2:** Express API, FE integration to back-end, Mocha+Chai tests with c8 coverage

---

## Project Status

Currently on **Sprint 2 — Back-End Integration** (Express, API wiring, tests).

