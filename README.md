# Community Skill Exchange Portal

**SE ZG503: Full Stack Application Development — Assignment 2026**
**Student:** Benedict Johnson | **BITS Pilani WILP**

A full-stack web application where users trade skills using a credit system — no money involved. Users register as learners or instructors, list skills they can teach, browse sessions, and exchange credits.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js, JWT Auth |
| Database | MongoDB Atlas (Mongoose ODM) |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| AI Tool | Claude (claude.ai) — Option A: Built from scratch with AI assistance |

---

## Project Structure

```
skill-exchange/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   ├── models/         (User, Skill, Session)
│   │   ├── routes/         (auth, skills, sessions, users)
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.js
│   │   ├── components/Navbar.js
│   │   ├── pages/          (Home, Login, Register, SkillsList, SkillDetail, SkillForm, Dashboard, AdminPanel)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
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
# Edit .env: add your MongoDB Atlas URI and a JWT secret
npm run dev
```

Backend runs at: `http://localhost:5000`  
Swagger API docs: `http://localhost:5000/api/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## User Roles

| Role | Capabilities |
|---|---|
| **Learner** | Browse skills, request sessions, submit feedback |
| **Instructor** | All of above + create/edit skills, approve/reject/complete sessions |
| **Admin** | Full access — manage all users, skills, sessions |

New users start with **5 credits**. Credits are deducted on session approval and earned on session completion (instructor).

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | None | Register user |
| POST | /api/auth/login | None | Login, get JWT |
| GET | /api/auth/me | Bearer | Own profile |
| GET | /api/skills | None | List/search/filter skills |
| POST | /api/skills | Instructor | Create skill |
| PUT | /api/skills/:id | Owner | Update skill |
| DELETE | /api/skills/:id | Owner/Admin | Delete skill |
| GET | /api/sessions | Bearer | Sessions (role-filtered) |
| POST | /api/sessions | Learner | Request session |
| PATCH | /api/sessions/:id/status | Bearer | Approve/reject/complete |
| POST | /api/sessions/:id/feedback | Learner | Rate completed session |
| GET | /api/users | Admin | All users |
| PUT | /api/users/profile | Bearer | Update profile |
| DELETE | /api/users/:id | Admin | Delete user |

Full interactive docs with request/response schemas at `/api/docs`.

---

## AI Usage
Built using **Option A** — from scratch with Claude (claude.ai) as AI assistant.  

## Video Recordings
https://drive.google.com/file/d/1nTfiFkauJrvR89xXxDHvcnlVxvSFWK1n/view?usp=sharing
