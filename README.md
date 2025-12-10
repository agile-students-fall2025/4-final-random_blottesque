# 🏠 Roomier

## Product Vision Statement
Roomier is a mobile web application designed to make shared living smoother, fairer, and less stressful by providing a centralized platform for roommates to coordinate chores, split expenses, track shared inventory, and maintain a harmonious living environment.

## 🌐 Live Demo
- **Frontend:** [https://roomier-panxo.ondigitalocean.app/login](https://roomier-panxo.ondigitalocean.app/login)
- **API:** [(https://roomier-panxo.ondigitalocean.app/final-random-blottesque-back-en2](https://roomier-panxo.ondigitalocean.app/final-random-blottesque-back-en2)

> Hosted on Digital Ocean Droplet: `ubuntu-s-1vcpu-1gb-nyc3-01`

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

### 🔐 Authentication
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Profile management with photo upload

### 👥 Group Management
- Create/join groups with invite codes
- Edit group details, description, and roommates
- **Upload group pictures**
- Mobile-first UI with clean, consistent styling

### 📋 Chore Scheduler
- Create, edit, and delete chores
- Assign tasks to roommates with due dates
- Mark chores as complete
- Repeat scheduling (Daily, Weekly, Monthly)

### 💰 Expense Splitter
- Log shared expenses with amounts
- Track who paid and who owes
- See "You owe / You're owed" summary

### 📦 Inventory Tracker
- Household item list with status (Low / Good / Full)
- Add, edit, and remove items
- Search/filter functionality

### 🌡️ Preferences
- Quiet hours configuration
- Temperature settings (°F)
- Guests, smoking, drinking, parties allowed settings
- Night-time guests and accommodations

### 📷 Profile & Group Pictures (Sprint 4)
- Upload profile photos
- Upload group pictures
- Image preview before upload
- Remove/change pictures

---

## Architecture

- **Front-end:** React (function components + JSX), client-side routing
- **Back-end:** Express.js with MongoDB
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing
- **File Uploads:** Multer for image handling
- **Validation:** express-validator for data validation
- **Testing:** Mocha + Chai + Supertest; c8 for coverage
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** Digital Ocean Droplet

---

## API Overview

Base URL: `http://localhost:4000/api`

### Health Check
- `GET  /health` → `{ ok: true, ts: "..." }`

### Authentication
- `POST /auth/signup` → Register new user
- `POST /auth/login` → Authenticate user
- `GET  /auth/me` → Get current user (requires Bearer token)

### Users
- `GET  /users/:id` → Get user by ID
- `PUT  /users/:id` → Update user profile

### Groups
- `GET  /groups` → List all groups
- `POST /groups` → Create group
- `GET  /groups/:id` → Get group details
- `PUT  /groups/:id` → Update group
- `DELETE /groups/:id` → Delete group
- `GET  /groups/:id/dashboard` → Get dashboard data
- `POST /groups/join` → Join group by invite code

### Preferences
- `GET  /groups/:id/prefs` → Get preferences
- `PUT  /groups/:id/prefs` → Update preferences

### Chores
- `GET  /groups/:id/chores` → List chores
- `POST /groups/:id/chores` → Create chore
- `PUT  /groups/:id/chores/:cid` → Update chore
- `DELETE /groups/:gid/chores/:cid` → Delete chore

### Expenses
- `GET  /groups/:id/expenses` → List expenses
- `POST /groups/:id/expenses` → Create expense
- `PUT  /groups/:id/expenses/:eid` → Update expense
- `DELETE /groups/:gid/expenses/:eid` → Delete expense

### Inventory
- `GET  /groups/:id/inventory` → List inventory
- `POST /groups/:id/inventory` → Create item
- `PUT  /groups/:id/inventory/:iid` → Update item
- `DELETE /groups/:gid/inventory/:iid` → Delete item

### Image Uploads (Sprint 4)
- `POST /uploads/profile/:id` → Upload profile picture
- `POST /uploads/group/:id` → Upload group picture
- `DELETE /uploads/profile/:id` → Remove profile picture
- `DELETE /uploads/group/:id` → Remove group picture

---

## Getting Started

### Prerequisites
- Node.js **18+**
- npm
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional, for containerized deployment)

---

## Option 1: Local Development

### 1) Back-end (Express)

```bash
cd back-end
npm install
```

Create a `.env` file based on `.env.example`:
```
PORT=4000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/roomier
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

Start the server:
```bash
npm run dev              # Development with auto-reload
# or
npm start                # Production
```

The API will be available at `http://localhost:4000`

### 2) Front-end (React)

```bash
cd front-end
npm install
```

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:4000/api
```

Start the development server:
```bash
npm start                # Opens http://localhost:3000
```

> **Important:** Run both servers in separate terminals during development.

---

## Option 2: Docker (Recommended for Deployment)

### Quick Start with Docker Compose

```bash
# From project root
docker-compose up --build

# Services:
# - Frontend: http://localhost:3000
# - Backend:  http://localhost:4000
# - MongoDB:  localhost:27017
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

---


### Quick Deployment Steps

1. Create a Digital Ocean Droplet (Ubuntu 24.04)
2. Install Docker on the Droplet
3. Clone the repository
4. Configure environment variables
5. Run `docker-compose up -d`


---

## Front-end Routes

### Authentication
- `/login` - User login
- `/signup` - User registration

### Dashboard & Groups
- `/` → Redirects to `/dashboard`
- `/dashboard` - Main dashboard
- `/groups/new` - Create new group
- `/groups/:groupId/edit` - Edit group (with photo upload)

### Chores
- `/chores` - Chores dashboard
- `/chores/add` - Add new chore
- `/chores/:choreId/edit` - Edit chore

### Expenses
- `/expenses` - Expenses dashboard
- `/expenses/new` - Add new expense
- `/expenses/:expenseId/edit` - Edit expense

### Inventory
- `/:groupId/inventory` - Inventory list
- `/:groupId/inventory/new` - Add new item
- `/:groupId/inventory/:itemId/edit` - Edit item

### Profile
- `/user-profile` - User profile page (with photo upload)

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
  * Resolve conflicts via merge commits
* Keep commits small and meaningful; reference the feature/issue in the message.

---

## Environment Variables

### Back-end (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/roomier` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |

### Front-end (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:4000/api` |

---

## Project Structure

```
roomier/
├── back-end/
│   ├── src/
│   │   ├── data/          # Database connection
│   │   ├── middleware/    # Auth & validation
│   │   ├── models/        # Mongoose schemas
│   │   └── routes/        # API endpoints
│   ├── test/              # Test files by team member
│   ├── uploads/           # Uploaded images
│   ├── Dockerfile
│   └── package.json
├── front-end/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (AppContext)
│   │   ├── lib/           # API client
│   │   └── pages/         # Route pages
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/
│   └── workflows/         
├── docker-compose.yml
├── docker-compose.prod.yml
├── DEPLOYMENT.md
└── README.md
```

---

## Project History

| Sprint | Focus | Status |
|--------|-------|--------|
| **Sprint 0** | UX design and clickable prototype in Figma | ✅ Complete |
| **Sprint 1** | Front-end screens, routing, mock data | ✅ Complete |
| **Sprint 2** | Express API, front-end/back-end integration, tests | ✅ Complete |
| **Sprint 3** | MongoDB Atlas integration, JWT authentication, validation | ✅ Complete |
| **Sprint 4** | Deployment, Docker | ✅ Complete |

---

## Extra Credit Completed (Sprint 4)

- ✅ **Docker Containerization** - Full Docker setup with docker-compose

---

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords for MongoDB
- Rotate JWT secrets periodically in production
- All passwords are hashed with bcrypt before storage
- File uploads are validated (type, size) and sanitized

---

## License

This project was created for NYU's Agile Software Development & DevOps course.
