# Community Skill Exchange Portal

**SE ZG503: Full Stack Application Development — Assignment 2026**  
**Student:** Benedict Johnson | **BITS Pilani WILP**

A full-stack web application where users trade skills using a virtual credit system — no money involved. Users register as learners or instructors, list skills they can teach, browse available sessions, and exchange credits for knowledge.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Context API |
| Backend | Node.js, Express.js, JWT Auth, bcryptjs |
| Database | MongoDB Atlas (Mongoose ODM) |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Deployment | Vercel (frontend) + Railway (backend) |
| AI Tool | Claude (claude.ai) — Option A: Built from scratch with AI assistance |

---

## Project Structure

```
elearn-lms/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   ├── models/           (User, Skill, Session)
│   │   ├── routes/           (auth, skills, sessions, users)
│   │   └── server.js
│   ├── .env.example
│   ├── Procfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.js
│   │   ├── components/       (Navbar, Logo)
│   │   ├── pages/            (Home, Login, Register, SkillsList, SkillDetail, SkillForm, Dashboard, AdminPanel)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docs/
│   └── documentation.html    ← Full project documentation (open in browser)
├── nixpacks.toml
├── DOCUMENTATION.md
└── README.md
```

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MongoDB Atlas URI and JWT secret
npm run dev
```

Backend runs at: `http://localhost:5000`  
Swagger API docs: `http://localhost:5000/api/docs`

**Required environment variables:**

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

**Required environment variables:**

```
REACT_APP_API_URL=https://your-backend.railway.app
```

---

## Deployment

| Service | Target | Config |
|---|---|---|
| [Vercel](https://vercel.com) | Frontend (React SPA) | `vercel.json` |
| [Railway](https://railway.app) | Backend (Express API) | `nixpacks.toml` + `Procfile` |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Database | `MONGO_URI` env var |

---

## User Roles

| Role | Capabilities |
|---|---|
| **Learner** | Browse skills, request sessions, cancel pending sessions, submit feedback |
| **Instructor** | All of the above + create/edit/delete own skills, approve/reject/complete sessions |
| **Admin** | Full access — manage all users, skills, and sessions via admin panel |

New users start with **5 credits**. Credits are deducted from the learner on session approval and transferred to the instructor on session completion.

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | None | Register new user |
| POST | /api/auth/login | None | Login, receive JWT |
| GET | /api/auth/me | Bearer | Get own profile |
| GET | /api/skills | None | List / search / filter skills |
| GET | /api/skills/:id | None | Get single skill detail |
| POST | /api/skills | Instructor/Admin | Create skill |
| PUT | /api/skills/:id | Owner/Admin | Update skill |
| DELETE | /api/skills/:id | Owner/Admin | Delete skill |
| GET | /api/sessions | Bearer | Sessions (role-filtered) |
| POST | /api/sessions | Learner/Admin | Request a session |
| PATCH | /api/sessions/:id/status | Bearer | Approve / reject / complete / cancel |
| POST | /api/sessions/:id/feedback | Learner | Rate a completed session |
| GET | /api/users | Admin | List all users |
| PUT | /api/users/profile | Bearer | Update own profile |
| GET | /api/users/:id | None | Public profile of any user |
| DELETE | /api/users/:id | Admin | Delete user |

Full interactive docs with request/response schemas at `/api/docs`.

---

## Documentation

Detailed project documentation (API reference, DB schema diagrams, architecture, component hierarchy, wireframes, and assumptions) is available as a self-contained HTML file:

```
docs/documentation.html   ← open in any browser
```

---

## AI Usage

Built using **Option A** — developed from scratch with [Claude](https://claude.ai) as AI assistant.

---

## Video Demo

[Watch on Google Drive](https://drive.google.com/file/d/1nTfiFkauJrvR89xXxDHvcnlVxvSFWK1n/view?usp=sharing)
