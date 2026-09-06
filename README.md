# Skill Swap 🔄

> **Student Peer-to-Peer Knowledge Sharing & Skill Exchange Platform**  
> Built for **Cloud Applications** and **Distributed Applications (DA)** courses.

Skill Swap is a full-stack platform where university students can offer skills they are proficient in (e.g., React, Python, Data Science, Figma, Cloud, Languages) and connect with other students who can teach skills they wish to learn — creating a free, collaborative barter-based learning network.

---

## 🌟 Key Features (Foundation Release)

- **Modern & Responsive UI**: Clean, accessible student interface built with React 18 and Lucide icons.
- **Engaging Landing Page**: Hero section, live platform statistics, and an intuitive "How It Works" 3-step walkthrough.
- **Interactive Navigation**: Seamless switching between **Home**, **Browse Skills**, **Add Skill**, and **Login/Register**.
- **Browse & Search Skills**:
  - Live instantaneous search by skill name, description, or keyword.
  - Multi-category filtering: *Programming*, *AI & Data Science*, *Design*, *DevOps & Cloud*, *Languages*, and *Academic*.
  - Skill cards showcasing proficiency level, student author, and what they want in exchange.
- **Add Skill (Create Listing)**: Modal form with instant live publishing to the database.
- **Skill Detail & Swap Proposals**: Preview full listing details and propose an exchange directly to the mentor.
- **User Authentication Foundation**: Register and login flow with pre-configured student accounts and 1-click Demo Login.
- **Cloud Database Ready**:
  - Full Mongoose schema support for **MongoDB Atlas** (Cloud DB).
  - Built-in **Zero-Config In-Memory Demo Fallback**: The app boots and runs out-of-the-box locally with rich sample data even before a cloud database URI is configured!
- **RESTful APIs & Microservices Capable**: Clean separation of frontend (`/client`) and backend (`/server`).

---

## 🏗️ Architecture & Tech Stack

```
[ Frontend: React + Vite ] (Port 5173)
         │
         │  RESTful JSON API Requests (/api/...)
         ▼
[ Backend: Express.js + Node.js ] (Port 5000)
         │
         ├───► [ MongoDB Atlas (Cloud Database) ]  (When MONGODB_URI configured)
         │
         └───► [ Local In-Memory Data Store ]      (Automatic fallback if offline/no URI)
```

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Lucide React, Modern CSS |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | MongoDB Atlas / Mongoose (with In-Memory Sample Fallback) |
| **Orchestration** | Concurrently, npm workspaces scripts |

---

## 📁 Project Structure

```text
SkillSwap/
├── client/                     # Frontend (React + Vite)
│   ├── index.html              # HTML shell
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite config with /api proxy
│   └── src/
│       ├── main.jsx            # React root mount
│       ├── App.jsx             # Main application state & tabs
│       ├── index.css           # Modern theme styling & variables
│       ├── services/
│       │   └── api.js          # Centralized API service layer
│       └── components/
│           ├── Navbar.jsx      # Sticky top navbar with Home, Browse, Add, Auth
│           ├── HeroSection.jsx # Landing page hero, stats & process
│           ├── CategoryFilter.jsx # Category pill selector
│           ├── SkillCard.jsx   # Individual skill card
│           ├── SkillDetailModal.jsx # Detail view & swap proposal modal
│           ├── AddSkillModal.jsx    # Skill listing creation form
│           ├── AuthModal.jsx   # Tabbed Login / Register modal
│           └── Footer.jsx      # Footer with course info
│
├── server/                     # Backend (Node.js + Express REST API)
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Express application entry point
│   ├── .env                    # Environment config (ignored in Git)
│   ├── .env.example            # Environment template
│   ├── config/
│   │   └── db.js               # Cloud MongoDB manager + In-Memory fallback
│   ├── models/
│   │   ├── User.js             # Mongoose User schema
│   │   └── Skill.js            # Mongoose Skill schema
│   ├── controllers/
│   │   ├── skillController.js  # CRUD operations for skills
│   │   └── authController.js   # Registration, login & user profiles
│   ├── routes/
│   │   ├── skillRoutes.js      # Routes for /api/skills
│   │   └── authRoutes.js       # Routes for /api/auth
│   └── data/
│       └── sampleData.js       # Pre-seeded student & skill data
│
├── .gitignore                  # Git ignore for node_modules, .env, dist
├── package.json                # Root package for running both client & server
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Installation
Clone the repository and install dependencies for the root, server, and client:

```bash
# Clone the repository
git clone https://github.com/Rohith-23-07/SKILL-SWAP.git
cd SKILL-SWAP

# Install all dependencies (root, backend, frontend) with one command:
npm run install:all
```

*(Alternatively, run `npm install` inside the root, `server/`, and `client/` directories.)*

### 3. Run Locally
To run both the frontend and backend concurrently with live hot-reloading:

```bash
npm run dev
```

The application will start at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ☁️ Connecting to Cloud Database (MongoDB Atlas)

The platform is designed to connect directly to **MongoDB Atlas**.

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your IP address (or `0.0.0.0/0` for development).
3. Copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/skillswap?retryWrites=true&w=majority
   ```
4. Open `server/.env` and paste your connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/skillswap?retryWrites=true&w=majority
   ```
5. Restart the server (`npm run dev`). The server will automatically detect MongoDB Atlas, connect, and seed initial student data into your cloud database!

> *Note: If `MONGODB_URI` is left blank, the app will continue to run seamlessly using the local in-memory store.*

---

## 📡 REST API Documentation

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | No | Check API and Database status |
| `POST` | `/api/auth/register` | No | Register a new student account (bcrypt hashed) |
| `POST` | `/api/auth/login` | No | Log in with email & password, returns JWT token |
| `GET` | `/api/auth/me` | **Yes (Bearer JWT)** | Retrieve current authenticated student profile |
| `PUT` | `/api/auth/me` | **Yes (Bearer JWT)** | Update current student profile (bio, university, skills) |
| `GET` | `/api/users` | No | List registered students (passwords excluded) |
| `GET` | `/api/users/:id` | No | View public student profile & their listed skills |
| `GET` | `/api/skills` | No | List skills (supports `?q=` search and `?category=`) |
| `GET` | `/api/skills/categories` | No | Get list of all available skill categories |
| `GET` | `/api/skills/:id` | No | Get details of a specific skill |
| `POST` | `/api/skills` | **Yes (Bearer JWT)** | Create new skill listing (ownership inferred from JWT) |
| `PUT` | `/api/skills/:id` | **Yes (Owner Only)** | Update skill listing (verified via JWT) |
| `DELETE` | `/api/skills/:id` | **Yes (Owner Only)** | Delete skill listing (verified via JWT) |

### Automated Testing
To run the automated test suites in `server/`:

```bash
cd server
npm run test:auth  # Runs complete 17-test suite for Auth, Protected CRUD & Profiles
npm run test:api   # Runs end-to-end API verification
```

---

## 👨‍💻 Contributing & Academic Attribution
Developed as part of the **Cloud Applications / Distributed Applications (DA)** academic coursework.
Feel free to submit pull requests or open issues for feature enhancements.
