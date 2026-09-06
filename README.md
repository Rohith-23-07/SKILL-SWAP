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

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check API and Database status |
| `GET` | `/api/skills` | List skills (Supports `?q=` search and `?category=` filter) |
| `GET` | `/api/skills/categories` | Get list of all available categories |
| `GET` | `/api/skills/:id` | Get details of a specific skill |
| `POST` | `/api/skills` | Create a new skill listing (CRUD: Create) |
| `PUT` | `/api/skills/:id` | Update an existing skill (CRUD: Update) |
| `DELETE` | `/api/skills/:id` | Delete a skill listing (CRUD: Delete) |
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Log in with email and password |
| `GET` | `/api/auth/me` | Retrieve current authenticated student profile |

### Sample Skill Creation Payload (`POST /api/skills`):
```json
{
  "title": "Machine Learning with PyTorch",
  "category": "AI & Data Science",
  "level": "Intermediate",
  "description": "Offering 1-on-1 tutoring on PyTorch tensors, neural networks, and model fine-tuning.",
  "swapPreferences": "Looking to learn React Native or Flutter mobile dev.",
  "tags": ["PyTorch", "Deep Learning", "Python"],
  "userName": "Alex Chen",
  "userUniversity": "State Institute of Technology"
}
```

---

## 👨‍💻 Contributing & Academic Attribution
Developed as part of the **Cloud Applications / Distributed Applications (DA)** academic coursework.
Feel free to submit pull requests or open issues for feature enhancements.
