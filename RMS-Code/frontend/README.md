# EfficienCity - Resource Management System

> A modern React/TypeScript application for municipal resource management with role-based interfaces for citizens, municipal employees, and system administrators.

## 📋 Table of Contents

- [Overview](#-overview)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Configuration Files Explained](#%EF%B8%8F-configuration-files-explained)
- [GitHub Setup Guide](#-github-setup-guide)
- [Team Collaboration](#-team-collaboration)
- [Troubleshooting](#-troubleshooting)
- [Common Questions](#-common-questions)
- [Additional Resources](#-additional-resources)

---

## 🎯 Overview

This frontend application was built using React with TypeScript, providing three distinct user interfaces:

- **Citizens**: Submit and track resource requests
- **Municipal Employees**: Process and manage citizen requests
- **System Administrators**: Oversee system operations and user management

The UI mockups were designed using Figma's AI tools with targeted guidance to achieve optimal user experience.

**Why React + TypeScript?**

- **High Performance**: Fast rendering and smooth user interactions
- **Scalability**: Easy to expand with new features
- **Type Safety**: TypeScript catches errors during development, not in production
- **Maintainability**: Component-based architecture makes code easy to understand and update
- **Reusability**: Components can be used across different parts of the application

---

## 🛠 Technology Stack

| Technology       | Purpose                 | Version |
| ---------------- | ----------------------- | ------- |
| **React**        | UI Framework            | 18.2.0  |
| **TypeScript**   | Type-safe JavaScript    | 5.2.2   |
| **Vite**         | Build tool & dev server | 5.2.0   |
| **Tailwind CSS** | Styling framework       | 3.4.17  |
| **Lucide React** | Icon library            | 0.363.0 |
| **PostCSS**      | CSS processing          | 8.4.38  |

---

## ✅ Prerequisites

Before starting, ensure you have:

### 1. Node.js (via NVM - Recommended)

**Why NVM?** It prevents permission issues and allows easy Node version management.

**Install NVM on Ubuntu/Mac:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Close and reopen your terminal, then:**

```bash
nvm install --lts
nvm use --lts
```

**Verify installation:**

```bash
node --version  # Should show v20.x.x or similar
npm --version   # Should show 10.x.x or similar
```

### 2. Git

**Check if installed:**

```bash
git --version
```

**If not installed (Ubuntu):**

```bash
sudo apt update
sudo apt install git
```

---

## 📦 Installation

### Step 1: Clone or Navigate to Project

```bash
# If starting fresh
cd /path/to/your/project

# If cloning from GitHub (for teammates)
git clone https://github.com/YOUR_USERNAME/efficiencity.git
cd efficiencity
```

### Step 2: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 3: Install Dependencies

```bash
npm install
```

**What this does:**

- Downloads all required packages listed in `package.json`
- Creates a `node_modules` folder (never commit this!)
- Generates `package-lock.json` for dependency version locking

---

## 🚀 Running the Application

### Start Development Server

```bash
npm run dev
```

### Open in Browser

1. Click the `http://localhost:5173/` link, or
2. Open your browser and navigate to `http://localhost:5173/`

### Stop the Server

Press `Ctrl + C` in the terminal

### Other Useful Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```bash
frontend/
├── components/          # Reusable React components
│   ├── ui/             # UI elements (buttons, cards, etc.)
│   └── ...
├── node_modules/
├── styles/
│   └── global.css      # Tailwind imports + theme variables
├── index.html          # HTML entry point
├── main.tsx            # React app entry point
├── App.tsx             # Main application component
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── package.json        # Dependencies and scripts
└── package-lock.json   # Locked dependency versions
├── ...
```

**Important Files:**

- **`package.json`**: Lists all dependencies and npm scripts
- **`main.tsx`**: Connects React to the HTML `#root` div
- **`App.tsx`**: Your main application logic starts here
- **`global.css`**: Contains Tailwind directives and CSS variables

---

## ⚙️ Configuration Files Explained

### package.json

**Purpose:** Defines project metadata, dependencies, and npm scripts

**Key Scripts:**

- `npm run dev` → Starts development server with hot reload
- `npm run build` → Compiles TypeScript + builds optimized production bundle
- `npm run preview` → Tests the production build locally

### vite.config.ts

**Purpose:** Configures Vite build tool

**What it does:**

- Enables React plugin for JSX transformation
- Sets up fast hot module replacement (HMR)

### tsconfig.json

**Purpose:** TypeScript compiler settings

**Key Settings:**

- `"jsx": "react-jsx"` → Modern JSX transform (no need to import React in every file)
- `"strict": true` → Enables all strict type-checking
- `"esModuleInterop": true` → Fixes React import issues

### tailwind.config.js

**Purpose:** Tailwind CSS customization

**Important:**

- `content: [...]` → Tells Tailwind where to look for class names
- **Our structure scans root-level files** (no `src/` folder)
- Custom theme variables match Shadcn UI design system

### postcss.config.js

**Purpose:** Processes CSS files

**What it does:**

- Runs Tailwind CSS transformations
- Adds vendor prefixes for browser compatibility

---

## 🐙 GitHub Setup Guide

### Initial Setup (First Time)

#### 1. Create `.gitignore`

**Why?** Prevents committing large/unnecessary files (like `node_modules`)

Create `frontend/.gitignore`:

```bash
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

#### 2. Initialize Git Repository

```bash
# In project root (not inside frontend/)
git init
```

#### 3. Push to GitHub

```bash
# Stage all files
git add .

# Commit with descriptive message
git commit -m "Initial commit: React + TypeScript frontend setup"

# Add remote repository (replace with YOUR GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/efficiencity-rms.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Making Changes & Updating

```bash
# Check what files changed
git status

# Stage changed files
git add .

# Commit with message
git commit -m "Add user authentication component"

# Push to GitHub
git push
```

---

## 👥 Team Collaboration

### For Teammates: First Time Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/efficiencity-rms.git
cd efficiencity-rms/frontend
```

#### 2. Install Dependencies

```bash
npm install
```

**This is crucial!** It reads `package.json` and installs exact versions from `package-lock.json`

#### 3. Run the Application

```bash
npm run dev
```

**That's it!** No configuration needed - everything is committed in the repo.

---

### For Teammates: Daily Workflow

#### Get Latest Changes

```bash
# Make sure you're in the project directory
cd efficiencity-rms

# Pull latest changes from GitHub
git pull
```

**⚠️ After pulling, ALWAYS run:**

```bash
cd frontend
npm install
```

**Why?** If someone added new dependencies, `package.json` changed and you need to install them.

#### Work on New Feature

```bash
# Create a new branch for your feature
git checkout -b feature/user-dashboard

# Make your changes...

# Stage and commit
git add .
git commit -m "Add user dashboard with activity feed"

# Push your branch
git push -u origin feature/user-dashboard
```

#### Merge Your Work

1. Go to GitHub repository
2. Click **"Pull requests"** → **"New pull request"**
3. Select your branch
4. Add description
5. Request review from teammates
6. After approval, click **"Merge pull request"**

---

## 🔧 Troubleshooting

### Problem: "Module not found" errors

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: Port 5173 already in use

**Solution:**

```bash
# Find process using port 5173
lsof -i :5173

# Kill it (replace PID with actual process ID)
kill -9 PID

# Or use a different port
npm run dev -- --port 3000
```

---

### Problem: TypeScript errors in IDE but code works

**Solution:**

```bash
# Restart TypeScript server (VS Code)
Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

---

### Problem: CSS not applying / Tailwind not working

**Check:**

1. Is `global.css` imported in `main.tsx`?
2. Are your component files in paths listed in `tailwind.config.js` content array?
3. Is dev server running?

**Solution:**

```bash
# Restart dev server
Ctrl+C
npm run dev
```

---

### Problem: Git push rejected / Authentication failed

**For HTTPS (recommended):**

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Use token as password when pushing

**Or use SSH:**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

---

### Problem: `npm install` fails with permission errors

**Solution (Ubuntu):**

```bash
# Use NVM (recommended - see Prerequisites)
# OR fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

---

## 🆘 Common Questions

**Q: Do I commit `node_modules`?**  
**A:** NO! Never. It's huge (100k+ files) and listed in `.gitignore`. Everyone runs `npm install` instead.

**Q: Do I commit `package-lock.json`?**  
**A:** YES! It locks dependency versions so everyone has identical packages.

**Q: Should I update dependencies?**  
**A:** Only if necessary. Run `npm outdated` to check. Update carefully: `npm update [package-name]`

**Q: How do I know what dependencies to install?**  
**A:** Just run `npm install`. It reads `package.json` automatically.

**Q: Can I use Yarn instead of NPM?**  
**A:** Yes, but stick to ONE package manager per project. Delete `package-lock.json` and use `yarn.lock` instead.

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
