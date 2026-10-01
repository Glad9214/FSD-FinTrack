# Personal Finance & Monthly Budget Tracker

A premium full-stack personal finance web application for tracking income, expenses, budgets, and financial analytics.

> **Track. Budget. Understand.**

---

## Features

- 📊 **Dashboard** — Financial overview with summary cards, charts, and recent transactions
- 💸 **Transactions** — Add, edit, delete, search and filter income/expense records
- 🎯 **Budget** — Set monthly spending budgets and track utilization
- 📈 **Analytics** — Category breakdown, income vs expense charts, spending trends
- 📅 **Monthly Summary** — Monthly totals, top categories, rule-based insights
- 🔐 **Authentication** — Secure JWT-based login and registration
- 📱 **Responsive** — Fully responsive across desktop, tablet, and mobile

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), React Router v6, Tailwind CSS |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |

---

## Project Architecture

```
fsd/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI primitives
│   │   │   └── layout/       # Layout components (Sidebar, Navbar)
│   │   ├── pages/            # Page-level components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API service layer (Axios)
│   │   ├── styles/           # Design tokens and theme
│   │   └── utils/            # Utility functions
│   └── package.json
│
├── server/                   # Express backend
│   ├── config/               # Database connection
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## Installation

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)

### Clone the Repository

```bash
git clone <your-repo-url>
cd fsd
```

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas URI (or leave default for automatic local persistent MongoDB)
npm run test:mongo    # Verify MongoDB connection & CRUD operations
npm run dev           # Start Express server with auto-reconnect
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Running the Application

| Service | Command | URL |
|---------|---------|-----|
| Backend | `cd server && npm run dev` | http://localhost:5000 |
| Frontend | `cd client && npm run dev` | http://localhost:5173 |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/budget` | Get monthly budget |
| POST | `/api/budget` | Set/update monthly budget |
| GET | `/api/analytics/summary` | Get financial summary |
| GET | `/api/analytics/categories` | Get category breakdown |
| GET | `/api/analytics/monthly` | Get monthly trend data |

---

## Screenshots

*Screenshots will be added after full UI completion.*

---

## Future Enhancements

- Export transactions to CSV/PDF
- Multi-currency support
- Recurring transaction templates
- Dark/light theme toggle
- Email notifications for budget alerts

---

## License

MIT License — built as a college Full Stack Development project.
