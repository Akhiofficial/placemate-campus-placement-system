# PlaceMate – Campus Placement Management System

**PlaceMate** is a role‑based campus placement web application that streamlines the placement process for students, recruiters, and college administrators (TPOs). It provides separate dashboards for each role and uses AI‑assisted resume analysis.

---

## 🚀 Tech Stack

- **Frontend**: React, React Router, Axios, CSS (or Tailwind if preferred)
- **Backend**: Node.js, Express, JWT, bcrypt
- **Database**: MongoDB (Atlas free tier)

---

## 📁 Project Folder Structure

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

**Why `.gitkeep` files are present**
Each empty directory contains a `.gitkeep` placeholder so Git tracks the folder structure even before any source files are added. This guarantees the required directories exist for the application to run and for collaborators to see the intended layout.

---

## ▶️ Running the Project Locally

### Frontend
```bash
cd client
npm install
npm run dev   # starts the Vite dev server (or npm start if using CRA)
```

### Backend
```bash
cd server
npm install
npm run dev   # starts the Node.js server (usually on http://localhost:5000)
```

Make sure to copy `.env.example` to `.env` and fill in the required values (MongoDB URI, JWT secret, etc.).

---

## 🤝 Contributing
Feel free to open issues or submit pull requests. Follow standard GitHub workflow: fork → branch → PR.

---


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




