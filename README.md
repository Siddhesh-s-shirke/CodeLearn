# CodeLearn 📚

A comprehensive platform for learning programming concepts through interactive lessons, hands-on challenges, and real-world projects.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

CodeLearn is an educational platform designed to help learners master programming concepts through a combination of theoretical knowledge and practical exercises. Whether you're a beginner starting your coding journey or an experienced developer looking to enhance your skills, CodeLearn provides structured learning paths tailored to different skill levels.

The platform emphasizes hands-on learning with interactive code editors, real-time feedback, and progressive difficulty levels to ensure a smooth learning experience.

## Features

### 🎓 Interactive Learning
- **Structured Lessons**: Well-organized curriculum covering fundamental to advanced programming concepts
- **Interactive Code Editor**: Built-in code editor with syntax highlighting and real-time execution
- **Instant Feedback**: Get immediate feedback on your code with detailed explanations

### 💪 Hands-on Practice
- **Coding Challenges**: Hundreds of progressively difficult coding problems
- **Multiple Languages Support**: Learn and practice in multiple programming languages
- **Automated Testing**: Automated test cases to validate your solutions

### 🎯 Progression Tracking
- **Learning Paths**: Curated learning sequences for different domains and skill levels
- **Progress Tracking**: Monitor your learning journey with detailed statistics
- **Achievement Badges**: Earn badges as you complete milestones

### 🏗️ Real-world Projects
- **Capstone Projects**: End-to-end projects that apply learned concepts
- **Code Review**: Get constructive feedback on your code from mentors
- **Peer Learning**: Collaborate and learn from other developers

### 📊 Analytics & Insights
- **Performance Metrics**: Detailed analytics on your learning performance
- **Difficulty Recommendations**: AI-powered suggestions for next learning steps
- **Time Tracking**: Monitor time spent on different topics

## Architecture

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- React.js - UI component library
- Redux - State management
- Axios - HTTP client

**Backend:**
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - NoSQL database
- JWT - Authentication

**Code Execution:**
- Docker - Containerization for secure code execution
- Sandbox Environment - Isolated execution environment

### System Components

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Layer                     │
│  (React SPA with responsive UI)                      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                   API Gateway                        │
│  (Express.js REST API)                               │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼────────┐
│  Auth Service  │   │ Learning Service│
│  (JWT-based)   │   │ (Content Mgmt)  │
└────────────────┘   └────────┬────────┘
                              │
                     ┌────────┴──────────┐
                     │                   │
            ┌────────▼────────┐  ┌──────▼──────┐
            │  Code Executor  │  │  Database   │
            │  (Docker)       │  │  (MongoDB)  │
            └─────────────────┘  └─────────────┘
```

### Data Model

- **Users**: Student profiles, authentication, progress tracking
- **Courses**: Learning paths, lessons, and structured content
- **Challenges**: Coding problems with test cases and solutions
- **Submissions**: User code submissions and execution results
- **Achievements**: Badges, certificates, and milestones

## Installation

### Prerequisites

- Node.js (v14.0 or higher)
- MongoDB (v4.4 or higher)
- Docker (for code execution environment)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Siddhesh-s-shirke/CodeLearn.git
cd CodeLearn
```

### Step 2: Install Dependencies

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd ../frontend
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/codelearn
DB_NAME=codelearn

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# Code Execution
DOCKER_HOST=unix:///var/run/docker.sock
CODE_EXECUTION_TIMEOUT=5000

# API Configuration
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or local MongoDB installation
mongod
```

### Step 5: Start the Application

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend (in another terminal):**
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### For Learners

1. **Sign Up / Login**: Create an account or log in with existing credentials
2. **Choose a Learning Path**: Select from curated learning paths based on your skill level
3. **Complete Lessons**: Read through lessons and understand concepts
4. **Solve Challenges**: Practice with coding challenges and get instant feedback
5. **Track Progress**: Monitor your learning statistics and achievements

### For Instructors

1. **Create Courses**: Design and structure your own learning courses
2. **Add Content**: Upload lessons, challenges, and resources
3. **Review Submissions**: Evaluate student submissions and provide feedback
4. **Manage Classes**: Organize students into classes or groups
5. **Analytics Dashboard**: Track student performance and engagement

### API Usage

#### Authentication

```bash
# Register
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "username": "username"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

#### Get Challenges

```bash
# Fetch all challenges
GET /api/challenges
Authorization: Bearer <token>

# Fetch specific challenge
GET /api/challenges/:id
Authorization: Bearer <token>
```

#### Submit Solution

```bash
# Submit code solution
POST /api/submissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "challengeId": "challenge_id",
  "code": "your_code_here",
  "language": "python"
}
```

## Project Structure

```
CodeLearn/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── config/            # Configuration files
│   │   └── app.js            # Express app setup
│   ├── tests/                 # Unit and integration tests
│   ├── .env.example          # Environment template
│   └── package.json          # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   ├── styles/           # CSS/SCSS files
│   │   ├── utils/            # Helper utilities
│   │   ├── App.js           # Root component
│   │   └── index.js         # Entry point
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
│
├── docker-compose.yml        # Docker services configuration
├── .gitignore               # Git ignore rules
├── README.md                # This file
└── LICENSE                  # License information
```

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the Repository**: Click the fork button on GitHub
2. **Create a Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your feature or fix
4. **Commit Changes**: `git commit -m "Add your meaningful commit message"`
5. **Push to Branch**: `git push origin feature/your-feature-name`
6. **Open a Pull Request**: Submit a PR with detailed description

### Code Standards

- Follow ESLint configuration for JavaScript
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Report Issues

Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Community

- 📖 **Documentation**: Check out our [Wiki](https://github.com/Siddhesh-s-shirke/CodeLearn/wiki)
- 💬 **Discussions**: Join our [GitHub Discussions](https://github.com/Siddhesh-s-shirke/CodeLearn/discussions)
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/Siddhesh-s-shirke/CodeLearn/issues)
- 📧 **Contact**: Reach out to the maintainers

---

**Happy Learning! 🚀**

Last Updated: 2026-01-02
