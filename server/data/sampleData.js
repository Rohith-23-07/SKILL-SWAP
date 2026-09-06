const sampleUsers = [
  {
    id: "user-1",
    _id: "660000000000000000000001",
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    university: "State Institute of Technology",
    bio: "CS Junior passionate about full-stack web engineering, distributed systems, and open-source.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    skillsOffered: ["Full-Stack React", "Node.js & Express", "C++ Algorithms"],
    skillsWanted: ["Machine Learning", "UI/UX Design", "Docker"],
    createdAt: new Date("2026-01-15T10:00:00Z")
  },
  {
    id: "user-2",
    _id: "660000000000000000000002",
    name: "Priya Sharma",
    email: "priya.sharma@university.edu",
    university: "Metropolitan University",
    bio: "Data Science student researching natural language processing and applied computer vision.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    skillsOffered: ["Python Data Science", "Machine Learning Basics", "Pandas & NumPy"],
    skillsWanted: ["Cloud Deployment", "React Frontend", "GraphQL"],
    createdAt: new Date("2026-02-01T14:30:00Z")
  },
  {
    id: "user-3",
    _id: "660000000000000000000003",
    name: "Jordan Lee",
    email: "jordan.lee@university.edu",
    university: "Design & Arts Academy",
    bio: "Product & UI/UX designer focusing on accessibility, micro-interactions, and design systems.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    skillsOffered: ["Figma UI/UX", "Design Systems", "Prototyping"],
    skillsWanted: ["Frontend React", "HTML/CSS Animation", "Next.js"],
    createdAt: new Date("2026-02-10T09:15:00Z")
  },
  {
    id: "user-4",
    _id: "660000000000000000000004",
    name: "Marcus Brody",
    email: "marcus.brody@university.edu",
    university: "Polytechnic University",
    bio: "DevOps and Cloud enthusiast exploring container orchestration, CI/CD pipelines, and Linux.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    skillsOffered: ["Docker & Containers", "Linux Shell Scripting", "Git & GitHub Workflows"],
    skillsWanted: ["Data Structures & Algorithms", "System Design", "SQL & Database Optimization"],
    createdAt: new Date("2026-02-18T11:45:00Z")
  },
  {
    id: "user-5",
    _id: "660000000000000000000005",
    name: "Elena Rostova",
    email: "elena.rostova@university.edu",
    university: "Central Humanities College",
    bio: "Linguistics graduate student fluent in 3 languages, interested in computational linguistics.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    skillsOffered: ["Conversational Spanish", "German for Beginners", "Academic Essay Writing"],
    skillsWanted: ["Python for NLP", "Web Scraping", "Data Analysis"],
    createdAt: new Date("2026-02-25T16:20:00Z")
  }
];

const sampleSkills = [
  {
    id: "skill-1",
    _id: "661000000000000000000001",
    title: "Full-Stack React & Node.js Application Development",
    description: "Learn how to build responsive, modern full-stack web applications using React hooks, REST APIs, and Express. I can guide you through real projects and debugging.",
    category: "Programming",
    level: "Intermediate",
    user: {
      id: "user-1",
      name: "Alex Chen",
      university: "State Institute of Technology",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    swapPreferences: "Looking to learn Machine Learning fundamentals or UI/UX Figma design.",
    tags: ["React", "JavaScript", "Node.js", "Web Development"],
    status: "Active",
    createdAt: new Date("2026-02-01T10:00:00Z")
  },
  {
    id: "skill-2",
    _id: "661000000000000000000002",
    title: "Python for Data Science, Pandas & ML Algorithms",
    description: "Hands-on tutoring on Python data analysis, cleaning datasets with Pandas, visualizing with Matplotlib/Seaborn, and training Scikit-Learn models.",
    category: "AI & Data Science",
    level: "Advanced",
    user: {
      id: "user-2",
      name: "Priya Sharma",
      university: "Metropolitan University",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
    },
    swapPreferences: "Want to learn Docker containerization, AWS cloud deployment, or React.",
    tags: ["Python", "Data Science", "Machine Learning", "Pandas"],
    status: "Active",
    createdAt: new Date("2026-02-05T12:30:00Z")
  },
  {
    id: "skill-3",
    _id: "661000000000000000000003",
    title: "UI/UX Design Systems & Interactive Wireframing in Figma",
    description: "I will teach you how to organize component libraries in Figma, create auto-layout UI components, wireframe user flows, and build interactive prototypes.",
    category: "Design",
    level: "Intermediate",
    user: {
      id: "user-3",
      name: "Jordan Lee",
      university: "Design & Arts Academy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    swapPreferences: "Interested in learning React component development or CSS animation techniques.",
    tags: ["Figma", "UI/UX", "Wireframing", "Product Design"],
    status: "Active",
    createdAt: new Date("2026-02-12T15:00:00Z")
  },
  {
    id: "skill-4",
    _id: "661000000000000000000004",
    title: "Docker Containerization & CI/CD Pipeline Fundamentals",
    description: "Understand Dockerfiles, multi-stage builds, docker-compose, and setting up automated GitHub Actions workflows for continuous deployment.",
    category: "DevOps & Cloud",
    level: "Intermediate",
    user: {
      id: "user-4",
      name: "Marcus Brody",
      university: "Polytechnic University",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    swapPreferences: "Want to practice Data Structures & Algorithms in C++ / Java for coding interviews.",
    tags: ["Docker", "DevOps", "CI/CD", "Linux"],
    status: "Active",
    createdAt: new Date("2026-02-20T08:45:00Z")
  },
  {
    id: "skill-5",
    _id: "661000000000000000000005",
    title: "Conversational Spanish & Accent Training",
    description: "Practice conversational Spanish through real dialogue, vocabulary expansion, pronunciation feedback, and cultural context. All levels welcome!",
    category: "Languages",
    level: "Beginner",
    user: {
      id: "user-5",
      name: "Elena Rostova",
      university: "Central Humanities College",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    swapPreferences: "Seeking guidance in Python programming or web scraping for text analysis.",
    tags: ["Spanish", "Language", "Conversation", "Grammar"],
    status: "Active",
    createdAt: new Date("2026-02-27T17:10:00Z")
  },
  {
    id: "skill-6",
    _id: "661000000000000000000006",
    title: "Data Structures & Algorithms Problem Solving (LeetCode)",
    description: "Master trees, graphs, dynamic programming, and two-pointer patterns. We will work through medium-to-hard coding problems with step-by-step intuition.",
    category: "Academic",
    level: "Advanced",
    user: {
      id: "user-1",
      name: "Alex Chen",
      university: "State Institute of Technology",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    swapPreferences: "Looking for someone to teach me Mobile App Design or iOS Swift.",
    tags: ["DSA", "LeetCode", "Algorithms", "Interview Prep"],
    status: "Active",
    createdAt: new Date("2026-03-01T11:20:00Z")
  }
];

module.exports = {
  sampleUsers,
  sampleSkills
};
