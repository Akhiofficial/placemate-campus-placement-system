# PlaceMate – Campus Placement Management System

PlaceMate is a role-based campus placement management web application designed to centralize and streamline the placement process for students, recruiters, and college administrators (TPOs).  
The project is developed collaboratively using a modern MERN-based architecture and follows industry-standard development workflows.

---

## 🚀 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Chart.js
- CSS / Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt for password hashing

### Database
- MongoDB (MongoDB Atlas – Free Tier)

---

## 📁 Project Folder Structure

This repository uses a **monorepo structure** containing both frontend and backend code.

placemate-campus-placement-system/
│
├── client/ # React Frontend
│ ├── public/ # Static files
│ ├── src/
│ │ ├── assets/ # Images, icons
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page-level components
│ │ │ ├── auth/ # Login & Signup pages
│ │ │ ├── student/ # Student dashboard pages
│ │ │ ├── company/ # Company dashboard pages
│ │ │ └── admin/ # Admin (TPO) pages
│ │ ├── routes/ # Role-based protected routes
│ │ ├── services/ # API calls (Axios)
│ │ ├── context/ # Authentication & user context
│ │ ├── utils/ # Helper functions
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Node.js Backend
│ ├── controllers/ # Business logic
│ │
│ ├── models/ # MongoDB schemas
│ │
│ ├── routes/ # API endpoints
│ │
│ ├── middleware/ # Auth & role-based access control
│ │
│ ├── services/ # Resume analysis / AI logic
│ │
│ ├── uploads/ # Uploaded resume files
│ │
│ ├── config/ # Database & environment config
│ │
│ ├── app.js # Express app configuration
│ └── server.js # Server entry point
│
├── .env.example # Environment variables template
├── .gitignore
├── README.md
└── package.json

yaml
Copy code

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



## ▶️ Running the Project Locally

### Frontend
```bash
cd client
npm install
npm run dev
Backend
cd server
npm install
npm run dev

🎯 Project Goal
PlaceMate aims to:

Centralize campus placement data

Provide real-time job application tracking

Enable secure role-based dashboards

Assist recruiters using AI-based resume analysis

Simplify placement monitoring for TPOs

The system is designed to be hackathon-ready, scalable, and aligned with real-world placement workflows.

