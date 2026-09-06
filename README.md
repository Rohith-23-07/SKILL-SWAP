# 🔄 Skill Swap

### Student Peer-to-Peer Skill Exchange Platform

> Learn a skill. Teach a skill. Exchange knowledge.

Skill Swap is a full-stack cloud-ready student peer-to-peer skill exchange platform. Students can list skills to be taught and learn new skills via skill-swapping.

Instead of paying for expensive classes or tutors, the student can find other students willing to teach them and offer what they know in return.

A peer-to-peer knowledge-sharing platform developed as an assignment for the course Cloud Applications & Distributed Applications (DA).

## ✨ What is Skill Swap?

Skill Swap allows students to teach and learn new skills, circumventing the need for costly classes and private tutors.
The platform was built to solve the problem that students often know a skill but lack a convenient way to find others who are willing to teach them a desired skill.
On the same note, students who are willing to teach a certain skill may lack a way to find others looking to learn it.
The below illustrates how Skill Swap solves that issue:
```text
👨‍💻 I can teach React
↓
🔍 Find someone who wants to learn React
↓
🤝 They can teach me Python
↓
📚 We exchange knowledge
```
### 🎯 Your Skills = Your Currency 💵
Skill Swap's unique proposition centers on a student's ability to teach skills, thereby obtaining a skill in exchange. In other words, students teach what they know and learn what they want.
The platform does not require payments or subscriptions. Instead, students leverage their skills to obtain the skills they desire.
## 🚀 Features
### 🏠 Modern Landing Page Design
A modern landing page design with an embedded "how it works" three-step process and other stats about the platform's activity.
### 🔎 Browse & Discover Skills
Browse other students' skills, search for specific skills, and filter them to narrow the search.
Each skill has its own set of categories, level of knowledge, and tags to help students find what they are looking to learn.
### 📚 Skill Categories
Skills are categorized in major areas such as:
Programming
AI/Data Science
Design
DevOps & Cloud
Languages
Academic Skills
### ➕ Add a Skill
Students can add their own skills, with detailed descriptions, what level they are at, what other skills they desire in exchange, and more.
Student's skill listings are sent to the backend via the API, and stored in the database.
### 🔄 Skill Swap proposals
Browse proposed skill swaps, view skill details, and directly communicate with the owner of a skill listing for a proposed swap.
### 🔒 Authentication
Student auth features such as register/login are built-in and ready to go out-of-the-box. A demo student is also available for testing purposes.
### ☁️ Cloud DB
Skill Swap is fully-prepared to utilize a cloud DB (such as MongoDB Atlas), but also includes an in-memory DB option for local testing.
### 📡 RESTful API
The frontend communicates with the backend via REST APIs.
The below demonstrates the overall application's design:
```text
Frontend
↓
REST API
↓
Backend
↓
Cloud DB ← Student Data
```
## 🏗️ Overview: Project Architecture
The project uses the following overall design:
```text
┌─────────────────────────┐
│    Skill Swap    │
│   React + Vite    │
│    Frontend     │
└────────────┬────────────┘
│
RESTful API
JSON Requests
│
▼
┌─────────────────────────┐
│   Express.js     │
│    Backend     │
│    Node.js      │
└────────────┬────────────┘
│
┌────────────┴────────────┐
│             │
▼             ▼
┌──────────────────┐   ┌──────────────────┐
│  MongoDB Atlas │   │ In-Memory Store │
│  Cloud Database │   │  Demo Fallback │
└──────────────────┘   └──────────────────┘
```
The below highlights the general flow of data across the application:
```text
User
↓
React UI
↓
API Service
↓
Express REST API
↓
Controller
↓
MongoDB / In-Memory Store
↓
JSON Response
↓
React UI
```
## 🛠️ Tech Used
| Layer       | Technologies       |
| ------------------ | ------------------------- |
| 🎨 Frontend    | React           |
| ⚡ Build Tool   | Vite           |
| 🎯 Icons     | Lucide React       |
| 🖥️ Backend    | Node.js + Express.js   |
| 🔗 API      | RESTful JSON APIs     |
| 🗄️ Database    | MongoDB Atlas       |
| 🧩 ODM       | Mongoose         |
| 🌐 Middleware   | CORS           |
| 🔐 Configuration | Dotenv          |
| ▶️ Development  | Concurrently       |
| 📦 Package Manager| npm            |
## 📁 Project Structure
```text
SKILL-SWAP/
│
├── client/
│  ├── index.html
│  ├── package.json
│  ├── vite.config.js
│  │
│  └── src/
│    ├── main.jsx
│    ├── App.jsx
│    ├── index.css
│    │
│    ├── services/
│    │  └── api.js
│    │
│    └── components/
│      ├── Navbar.jsx
│      ├── HeroSection.jsx
│      ├── CategoryFilter.jsx
│      ├── SkillCard.jsx
│      ├── SkillDetailModal.jsx
│      ├── AddSkillModal.jsx
│      ├── AuthModal.jsx
│      └── Footer.jsx
│
├── server/
│  ├── package.json
│  ├── server.js
│  ├── .env
│  ├── .env.example
│  │
│  ├── config/
│  │  └── db.js
│  │
│  ├── models/
│  │  ├── User.js
│  │  └── Skill.js
│  │
│  ├── controllers/
│  │  ├── skillController.js
│  │  └── authController.js
│  │
│  ├── routes/
│  │  ├── skillRoutes.js
│  │  └── authRoutes.js
│  │
│  └── data/
│    └── sampleData.js
│
├── .gitignore
├── package.json
└── README.md
```
# ⚙️ Getting Started
## 1️⃣ Prerequisites
Install the below tools on your machine if you don't have them:
Node.js 18+
npm 9+
MongoDB Atlas account (optional for local development/demo)
## 2️⃣ Clone this repo
```bash
git clone https://github.com/Rohith-23-07/SKILL-SWAP.git
cd SKILL-SWAP
```
## 3️⃣ Install packages
Install the needed packages for the root, client, and server:
```bash
npm run install:all
```
OR:
```bash
npm install
cd server && npm install
cd ../client && npm install
```
## 4️⃣ Configure MongoDB Atlas (Optional)
The application is designed to utilize MongoDB Atlas for persistent cloud data storage. However, it also includes an in-memory DB fallback option for local development.
In order to configure MongoDB Atlas:
1. Create .env file inside the server directory
2. Enter the below environment variables:
```text
PORT=5000
MONGODB_URI=mongodb+srv://
```
Replace `` with your own MongoDB connection string.
If you do not wish to configure MongoDB Atlas, the in-memory DB will be used as a fallback option.
This file should not be added to the git repo, which is why it's added to the .gitignore file:
```text
git add .gitignore
```
## 5️⃣ Launch the app
From the root directory, launch the application:
```bash
npm run dev
```
The below will display the URLs for the frontend, backend, and health check endpoints:
```text
Frontend: http://localhost:5173
Backend: http://localhost:5000
Health: http://localhost:5000/api/health
```
Then, open your browser and navigate to the below URL:
```text
http://localhost:5173
```
## ☁️ MongoDB Atlas Database
Skill Swap features MongoDB Atlas support as its cloud database provider:
```text
React Frontend
↓
Express REST API
↓
Mongoose
↓
MongoDB Atlas
↓
Persistent Cloud Data
```
When the MONGODB_URI is set, the below will occur:
1. The backend will connect to MongoDB Atlas
2. The Mongoose ODM will handle the database operations
3. The application will store data in a persistent cloud database
4. Sample data will be seeded if needed
If the MONGODB_URI is not set, the below will occur instead:
```text
Application
↓
In-Memory Data Store
↓
Sample Data
```
The in-memory option serves as a convenient fallback option for local development without needing to configure a cloud database.
## 📡 REST API
Below are some of the most common endpoints used by the application:
### 🧪 Health
| Method | URL       | Description           |
| ------ | ---------------- | ------------------------------- |
| `GET` | `/api/health`  | Checks if the backend is running |
### 📚 Skills
| Method | URL         | Description           |
| ------ | -------------------- | ------------------------------- |
| `GET` | `/api/skills`    | Get all skills         |
| `GET` | `/api/skills/categories` | Get skill categories   |
| `GET` | `/api/skills/:id`  | Get a single skill       |
| `POST` | `/api/skills`    | Create a new skill       |
| `PUT` | `/api/skills/:id`  | Update an existing skill    |
| `DELETE`| `/api/skills/:id`  | Delete a skill         |
#### 🔍 Searching, Filtering:
Below are examples of using query parameters to search and filter skills:
Search:
```text
GET /api/skills?q=React
```
Filter by category:
```text
GET /api/skills?category=Programming
```
Both:
```text
GET /api/skills?q=Python&category=Programming
```
### 🔒 Authentication
| Method | URL         | Description           |
| ------ | -------------------- | ------------------------------- |
| `POST` | `/api/auth/register` | Registers a new student   |
| `POST` | `/api/auth/login`  | Logins a student        |
| `GET` | `/api/auth/me`    | Gets info about the logged-in student |
## 🔄 CRUD Operations
Skill Swap implements a complete set of CRUD operations for skills:
```text
CREATE
↓
Student registers
↓
READ
↓
Browses skills
↓
UPDATE
↓
Updates a skill
↓
DELETE
↓
Deletes a skill
```
Below are the HTTP methods assigned to each operation:
| Operation | Method | URL       |
| --------- | ------ | ---------------- |
| `Create` | `POST` | `/api/skills`  |
| `Read`  | `GET` | `/api/skills`  |
| `Update` | `PUT` | `/api/skills/:id` |
| `Delete` | `DELETE`| `/api/skills/:id` |
## 🧪 API Example
Below is an example of a request to create a skill:
### 📤 Create Skill
`POST /api/skills`:
```http
POST /api/skills
Content-Type: application/json
```
```json
{
"title": "Machine Learning with PyTorch",
"category": "AI & Data Science",
"level": "Intermediate",
"description": "1-on-1 tutoring on PyTorch, neural networks and model finetuning.",
"swapPreferences": "Looking to learn React Native or Flutter.",
"tags": [
"PyTorch",
"Deep Learning",
"Python"
],
"userName": "Alex Chen",
"userUniversity": "State Institute of Technology"
}
```
## 🎓 Real-World Cloud Applications & Distributed Applications Concepts
Skill Swap demonstrate the below real-world concepts related to Cloud Applications and Distributed Applications:
Cloud database
Client-server
REST API
Database
CRUD operations
Distributed applications
Backend development
Authentication
Frontend-backend separation
API
## 🧠 Things we've learned
The below is a summary of what is learned while building the Skill Swap application:
```text
React
↓
Frontend Dev
↓
REST APIs
↓
Node.js + Express
↓
MongoDB + Mongoose
↓
Cloud DB
↓
Full-stack Dev
```
In addition to Git, env variables, APIs, database schemas, backend controllers, routing, component-based development, cloud-friendly application design, etc.
## 🔮 Future improvements
Skill Swap is just the beginning. There is a long road of future improvements ahead, including:
Student messaging
Swap requests
Notifications
Ratings/reviews
Student profiles
Scheduling system
Activity dashboard
JWT auth
Authorization
Deployment
PWA
Matching algorithm
AI-powered recommendations
## 🚀 Future Vision
The ultimate vision for Skill Swap is to develop it into a full-blown marketplace for student knowledge exchange, where students can learn and teach skills for free:
```text
SKILL SWAP
│
┌────────────┼────────────┐
▼      ▼      ▼
Discover   Connect   Exchange
│      │      │
└────────────┼────────────┘
▼
Learn Together
```
A student should not have to pay to learn a skill. Often, the skill that one possesses can be utilized to obtain the skill that one desires.
