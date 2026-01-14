# PlaceMate – Campus Placement Management System

PlaceMate is a role-based campus placement management web application designed to centralize placement activities for students, recruiters, and college administrators.  
The project is developed collaboratively using a modern MERN-based approach.

---

## 📌 Tech Stack

**Frontend**
- React.js
- React Router
- Axios
- Chart.js
- CSS / Tailwind CSS

**Backend**
- Node.js
- Express.js
- JWT Authentication
- bcrypt for password hashing

### Database
- MongoDB (MongoDB Atlas – Free Tier)

---

# 📁 Project Folder Structure

The repository follows a monorepo layout with separate **client** (React) and **server** (Node.js) sections.

```
placemate-campus-placement-system/
│
├── client/                 # React Frontend
│   ├── public/             # Static files
│   └── src/
│       ├── assets/        # Images, icons
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page‑level components
│       │   ├── auth/      # Login & Signup pages
│       │   ├── student/   # Student dashboard pages
│       │   ├── company/   # Company dashboard pages
│       │   └── admin/     # Admin (TPO) pages
│       ├── routes/        # Protected & role‑based routes
│       ├── services/      # API calls (Axios)
│       ├── context/       # Auth & user context
│       ├── utils/         # Helper functions
│       ├── App.jsx
│       └── main.jsx
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── controllers/        # Business logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & role middleware
│   ├── services/           # Resume analysis / AI logic
│   ├── uploads/            # Uploaded resume files
│   ├── config/             # DB & environment config
│   ├── app.js
│   └── server.js
│
├── .env.example           # Environment variables template
├── .gitignore
├── README.md
└── package.json           # Optional root scripts
```

## 🔐 Admin Creation Guide

There are two types of Admins in the system: **Super Admin** (created via script) and **Standard Admins/Sub-Admins** (created via request flow).

### 1. Prerequisite: Environment Variables
Ensure your `server/.env` file contains the `ADMIN_CREATION_KEY`.
```env
ADMIN_CREATION_KEY=admin_secret_key_2024_placemate
```

### 2. Creating the Super Admin
Run the seed script to create the initial Super Admin account:
```bash
node server/scripts/createSuperAdmin.js
```
*   **Email**: `superadmin@placemate.com`
*   **Password**: `SuperAdmin@123`

### 3. Creating a Sub-Admin (Standard Admin)
This is a secure 2-step process involving an API Request and Approval.

#### Step 1: Request Admin Access
Send a `POST` request to `/api/auth/request-admin` with the secret key.
**Body (JSON):**
```json
{
    "name": "New Admin Name",
    "email": "newadmin@college.edu",
    "password": "SecurePassword123",
    "adminKey": "admin_secret_key_2024_placemate"
}
```
*Note: If the `adminKey` does not match the one in `.env`, the request will be rejected.*

#### Step 2: Approve the Request (Super Admin Only)
1.  Login as **Super Admin**.
2.  Fetch pending requests: `GET /api/admin/admin-requests`.
3.  Copy the `_id` of the pending request.
4.  Approve it: `PUT /api/admin/admin-requests/<REQUEST_ID>/approve`.

Once approved, the new admin can log in normally.

### 🧪 API Testing
A **Postman Collection** is included in the `server/` directory:
`Admin_Dashboard.postman_collection.json`
Import this into Postman to easily test the entire flow (Login, Request Admin, Approve, Get Stats).

---

## 🔄 Development Workflow

We follow a **feature-based collaborative development workflow** to ensure clean code, parallel development, and easy integration.

### 🌿 Branch Strategy

main → Stable & final demo-ready code
dev → Active development and integration
feature/* → Individual workflows or features



### 🔧 Example Feature Branches
- `feature/auth-workflow`
- `feature/student-dashboard`
- `feature/resume-upload`
- `feature/job-application`
- `feature/company-dashboard`
- `feature/admin-analytics`

---

## 🧑‍🤝‍🧑 Team Collaboration Process

1. Pull the latest `dev` branch
2. Create a new `feature/*` branch for your task
3. Implement and test the feature locally
4. Commit changes with meaningful messages
5. Push the feature branch to GitHub
6. Create a Pull Request (PR) to merge into `dev`
7. After review and testing, merge `dev` into `main`

---

## 📝 Commit Message Convention

Use clear and descriptive commit messages:

feat: add student job application workflow
fix: resolve JWT authentication issue
ui: improve dashboard layout
docs: update README
