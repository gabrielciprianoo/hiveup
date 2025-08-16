
# 🐝 HiveUp

**HiveUp** is a lightweight project and task manager for small teams.  
The project is organized in a **monorepo with pnpm workspaces**, separating the backend (API) and the frontend (Web).

## 📂 Project Structure

- hiveup/
  - apps/
    - api/ — Backend: Node.js + Express + TypeScript
    - web/ — Frontend: React + Vite + TailwindCSS
  - packages/ — Shared libraries (UI, types, utils)
  - pnpm-workspace.yaml
  - package.json
  - README.md


## 🚀 Stack

- ⚙️ Backend: Node.js + Express + TypeScript  
- 💻 Frontend: React + Vite + TailwindCSS  
- 📦 Monorepo Management: pnpm Workspaces  

## ⚡️ Main Commands

Run these from the project root:

pnpm install          # 📥 Install dependencies  
pnpm --filter api dev # 🛠️ Start API in dev mode  
pnpm --filter web dev # 🎨 Start frontend in dev mode  
pnpm -r build         # 🏗️ Build all projects  

## 🌱 Initial State

This repo currently only contains the **base monorepo structure**.  
In future branches, new features will be added, such as:
- 🔑 REST API with authentication and models (Projects, Tasks, Collaborators).  
- 🎨 Frontend using Atomic Design and a Kanban-style board.  
- 🧩 Shared scripts and configuration in `packages/`.  

## 📌 Notes

- The project is under active development and will grow incrementally using feature branches (`feature/*`, `task/endpoint/*`, etc.).  
- Check the `main` branch for the latest stable version.
