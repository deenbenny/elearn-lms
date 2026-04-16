# ELearn LMS

# Community Skill Exchange Portal — Documentation

**SE ZG503: Full Stack Application Development**
**Student:** Benedict Johnson

---

## 1. Problem Statement

Schools, neighbourhoods, and online communities have members who are skilled in one area and want to learn another — yet skill-sharing is largely informal and untracked. The **Community Skill Exchange Portal** solves this by providing a structured platform where users register skills they can teach, browse skills they want to learn, request sessions, and exchange credits — with no money involved.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────┐
│         React Frontend (Port 3000)  │
│  React Router · Axios · Context API │
└────────────────┬────────────────────┘
                 │ HTTP / REST
┌────────────────▼────────────────────┐
│       Express.js Backend (Port 5000)│
│  JWT Auth · Mongoose · Swagger UI   │
└────────────────┬────────────────────┘
                 │ Mongoose ODM
┌────────────────▼────────────────────┐
│         MongoDB Atlas (Cloud)        │
│   Users · Skills · Sessions         │
└─────────────────────────────────────┘
```

**Architecture pattern:** Monolithic frontend + RESTful microservice-style backend with domain-separated routes. Each resource (auth, skills, sessions, users) is handled by its own Express router module.

---

## 3. Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Auto-generated |
| name | String | Required |
| email | String | Unique, required |
| password | String | bcrypt hashed |
| role | Enum | learner / instructor / admin |
| skillsOffered | [String] | Tags of skills they can teach |
| skillsWanted | [String] | Tags of skills they want to learn |
| credits | Number | Default: 5 |
| bio | String | Optional profile bio |
| rating | Number | Avg rating from feedback |
| totalSessions | Number | Completed sessions count |

### Skill
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Auto-generated |
| title | String | Required |
| description | String | Required |
| category | Enum | Technology, Music, Languages, Arts, Sports, Cooking, Academic, Other |
| instructor | ObjectId | Ref: User |
| creditsRequired | Number | Credits per session (min 1) |
| maxParticipants | Number | Default: 1 |
| isActive | Boolean | Soft toggle |
| tags | [String] | Search tags |

### Session
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Auto-generated |
| skill | ObjectId | Ref: Skill |
| learner | ObjectId | Ref: User |
| instructor | ObjectId | Ref: User |
| scheduledAt | Date | Required |
| status | Enum | pending / approved / rejected / completed / cancelled |
| creditsUsed | Number | Snapshot at time of booking |
| notes | String | Learner's notes |
| feedback.rating | Number | 1–5, post-completion |
| feedback.comment | String | Optional comment |

---

## 4. Component Hierarchy

```
App
├── AuthProvider (Context)
├── Router
│   └── Navbar
│       ├── Home
│       ├── Login
│       ├── Register
│       ├── SkillsList          ← Browse + Search + Filter
│       ├── SkillDetail         ← View + Request Session
│       ├── SkillForm           ← Create Skill (instructor/admin)
│       ├── Dashboard           ← Sessions management per role
│       └── AdminPanel          ← User/Skill/Session oversight
```

---

## 5. API Endpoints

Full interactive Swagger docs are available at `http://localhost:5000/api/docs` when the backend is running.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | None | Register new user |
| POST | /api/auth/login | None | Login, returns JWT |
| GET | /api/auth/me | Bearer | Get own profile |

### Skills
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/skills | None | List all (search/filter) |
| GET | /api/skills/:id | None | Get single skill |
| POST | /api/skills | Instructor/Admin | Create skill |
| PUT | /api/skills/:id | Owner/Admin | Update skill |
| DELETE | /api/skills/:id | Owner/Admin | Delete skill |

### Sessions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/sessions | Bearer | Get sessions (role-filtered) |
| POST | /api/sessions | Learner | Request session |
| PATCH | /api/sessions/:id/status | Bearer | Update status |
| POST | /api/sessions/:id/feedback | Learner | Submit feedback |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/users | Admin | List all users |
| PUT | /api/users/profile | Bearer | Update own profile |
| GET | /api/users/:id | None | Public profile |
| DELETE | /api/users/:id | Admin | Delete user |

---

## 6. Role-Based Access

| Feature | Learner | Instructor | Admin |
|---|---|---|---|
| Browse skills | ✓ | ✓ | ✓ |
| Request session | ✓ | — | ✓ |
| Create skill | — | ✓ | ✓ |
| Approve/reject session | — | ✓ | ✓ |
| Mark session complete | — | ✓ | ✓ |
| Submit feedback | ✓ | — | — |
| View all users | — | — | ✓ |
| Delete any skill/user | — | — | ✓ |

---

## 7. Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm run dev
# Server runs at http://localhost:5000
# Swagger docs at http://localhost:5000/api/docs
```

### Frontend
```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000
```

---

## 8. Assumptions
- Credits are virtual; no real payment integration.
- New users receive 5 starter credits on registration.
- Credits are deducted from the learner when a session is approved.
- Instructors earn credits when a session is marked complete.
- Overlapping bookings for the same skill at the same time are prevented server-side.
- Swagger UI provides the complete interactive API documentation.
