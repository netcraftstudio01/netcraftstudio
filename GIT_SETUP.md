# Git Setup Guide for NetCraft Studio

## Overview
This guide explains how to properly use Git with this project, including handling sensitive files using `.gitignore`.

## File Protection Strategy

### 1. `.gitignore` - Prevents Sensitive Files from Being Committed
**Location:** `/.gitignore`

**Protected Files:**
```
.env                          # ❌ NEVER commit (contains secrets)
.env.local                    # ❌ NEVER commit (local overrides)
.env.*.local                  # ❌ NEVER commit (environment-specific)
node_modules/                 # ❌ NEVER commit (too large)
dist/                         # ❌ NEVER commit (build output)
.vscode/                      # ⚠️ OPTIONAL (team preferences)
.idea/                        # ⚠️ OPTIONAL (IDE settings)
```

### 2. `.env.example` - Template for Configuration
**Location:** `/.env.example`

**Purpose:** Shows what environment variables are needed without exposing actual values

**Content:** All variable names with placeholder values

## Step-by-Step Git Setup

### Initial Setup (First Time)

```bash
# 1. Clone the repository
git clone https://github.com/netcraftstudio01/netcraftstudio.git
cd netcraft-website

# 2. Install dependencies
npm install

# 3. Create your local .env file from template
cp .env.example .env

# 4. Fill in your actual credentials in .env
# Edit .env with your database, email, and Cloudinary credentials
```

### Verify .env is NOT Tracked

```bash
# Check if .env is being tracked (should NOT appear)
git status

# If .env was accidentally committed before:
git rm --cached .env                    # Remove from Git
echo ".env" >> .gitignore               # Add to gitignore
git add .gitignore
git commit -m "Remove .env from tracking"
git push
```

## Remote Repository Operations

### Adding Multiple Remotes

```bash
# Add original repository as 'origin'
git remote add origin https://github.com/YOUR-USERNAME/repo.git

# Add team repository as 'newpush'
git remote add newpush https://github.com/netcraftstudio01/netcraftstudio.git

# View all remotes
git remote -v
```

### Fetch From Remote

```bash
# Fetch from specific remote without merging
git fetch newpush main

# Fetch from all remotes
git fetch --all
```

### Pull From Remote

```bash
# Pull from newpush remote
git pull newpush main

# Pull and allow unrelated histories (first time merge)
git pull newpush main --allow-unrelated-histories
```

### Push To Remote

```bash
# Push to newpush remote
git push newpush main

# Push to origin remote
git push origin main

# Push all remotes
git push --all
```

## Common Git Workflows

### Workflow 1: Pull Latest Changes Before Pushing

```bash
# 1. Fetch latest from remote
git fetch newpush main

# 2. Pull to your local branch
git pull newpush main

# 3. Make your changes and commit
git add .
git commit -m "Your commit message"

# 4. Push to remote
git push newpush main
```

### Workflow 2: Sync Multiple Remotes

```bash
# Fetch from main source
git fetch newpush main

# Fetch from your fork
git fetch origin main

# Merge newpush into local
git merge newpush/main

# Push to your remote
git push origin main
```

### Workflow 3: Create a Feature Branch

```bash
# Create new branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch to remote
git push newpush feature/new-feature

# Create Pull Request on GitHub
```

## Handling Merge Conflicts

### If You Get: "Updates were rejected because the tip of your current branch is behind"

```bash
# Pull remote changes first
git pull newpush main

# If there are conflicts, resolve them manually

# After resolving, stage the changes
git add .

# Commit the merge
git commit -m "Merge remote changes"

# Push the merged result
git push newpush main
```

## SSL Certificate Issues Workaround

### If You Get SSL Certificate Error

```bash
# Temporarily disable SSL verification (NOT RECOMMENDED for production)
git config --global http.sslVerify false

# OR use SSH instead of HTTPS:
# Generate SSH key: ssh-keygen -t ed25519 -C "your-email@example.com"
# Add key to GitHub settings
# Use SSH URL: git@github.com:username/repo.git
```

## Commit Best Practices

### Good Commit Messages

```bash
# ✅ GOOD - Clear and descriptive
git commit -m "Add Cloudinary image upload functionality"
git commit -m "Fix portfolio image loading from database"
git commit -m "Update environment configuration template"

# ❌ BAD - Vague or unhelpful
git commit -m "Update stuff"
git commit -m "Fix bug"
git commit -m "Changes"
```

### Atomic Commits (One Feature Per Commit)

```bash
# ✅ GOOD - Separate concerns
git commit -m "Add image upload hook"
git commit -m "Update admin panel with upload UI"
git commit -m "Update database schema for image URLs"

# ❌ BAD - Too many changes together
git commit -m "Add images, fix bugs, update styles, refactor code"
```

## Checking What Will Be Committed

```bash
# See what will be committed
git status

# See what changes in specific file
git diff src/pages/Admin.tsx

# See staged changes
git diff --staged

# See all changes since last commit
git diff HEAD
```

## Undoing Changes

```bash
# Undo uncommitted changes in a file
git checkout -- src/file.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View commit history
git log --oneline
```

## Viewing Logs

```bash
# View commit history
git log

# View condensed history
git log --oneline

# View last 10 commits
git log -10

# View commits for specific file
git log src/pages/Admin.tsx

# View with graph (branches)
git log --graph --oneline --all
```

## Environment Variables Setup

### Step 1: Copy Template
```bash
cp .env.example .env
```

### Step 2: Fill in Values
Edit `.env` with your actual credentials:
- Database credentials (from Supabase)
- Email credentials (Gmail app password)
- Cloudinary credentials
- API URLs

### Step 3: Verify in .gitignore
Confirm `.env` is in `.gitignore`:
```bash
grep "^\.env$" .gitignore
```

### Step 4: Verify Not Tracked
```bash
git status          # Should NOT show .env
```

## Team Collaboration

### Sharing New Environment Variables

When adding new environment variables:

1. **Update** `.env.example` with new variables
2. **Commit** `.env.example` to Git
3. **Notify team** that new `.env` variables are needed
4. **Each team member** updates their local `.env` file

```bash
# Example notification in git message
git commit -m "Add CLOUDINARY env vars - team must update .env"

# Then push
git push newpush main
```

## Quick Reference

```bash
# Setup
git clone <repo-url>
cp .env.example .env
npm install

# Daily workflow
git fetch newpush main
git pull newpush main
# ... make changes ...
git add .
git commit -m "Description of changes"
git push newpush main

# Check status anytime
git status

# View what changed
git diff

# Undo mistakes
git reset --hard HEAD~1     # Undo last commit
git checkout -- file.tsx    # Undo file changes
```

## Important Rules

✅ **DO:**
- ✅ Commit `.env.example`
- ✅ Commit `package.json` and `package-lock.json`
- ✅ Commit `.gitignore`
- ✅ Pull before pushing
- ✅ Write clear commit messages
- ✅ Use `.env.example` as a template

❌ **DON'T:**
- ❌ Commit `.env` file
- ❌ Commit `node_modules` directory
- ❌ Commit `dist` folder
- ❌ Commit API keys or passwords
- ❌ Commit IDE-specific settings
- ❌ Force push to main branch

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Gitignore Template](https://github.com/github/gitignore)
- [Commit Message Best Practices](https://www.conventionalcommits.org/)

---

**Last Updated:** February 17, 2026  
**Project:** NetCraft Website  
**Team:** NetCraft Studio
