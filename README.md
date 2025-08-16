cat > README.md << 'EOF'
# 🐝 HiveUp

HiveUp es un gestor ligero de proyectos y tareas para equipos pequeños.  
El proyecto está organizado en un **monorepo con pnpm workspaces**, donde separamos el backend (API) y el frontend (Web).

## 📂 Estructura del proyecto

hiveup/
├── apps/
│   ├── api/        # Backend en Node.js + Express + TypeScript
│   └── web/        # Frontend en React + Vite + TailwindCSS
├── packages/       # 📦 Librerías compartidas (UI, tipos, utils)
├── pnpm-workspace.yaml
├── package.json
└── README.md

## 🚀 Stack

- ⚙️ Backend: Node.js + Express + TypeScript  
- 💻 Frontend: React + Vite + TailwindCSS  
- 📦 Gestión: pnpm Workspaces (monorepo)  

## ⚡️ Comandos principales

Desde la raíz del proyecto:

pnpm install          # 📥 Instalar dependencias  
pnpm --filter api dev # 🛠️ Levantar API en modo dev  
pnpm --filter web dev # 🎨 Levantar frontend en modo dev  
pnpm -r build         # 🏗️ Compilar todos los proyectos  

## 🌱 Estado inicial

Este repo actualmente solo contiene la **estructura base del monorepo**.  
En ramas posteriores se irán agregando funcionalidades como:
- 🔑 API REST con autenticación y modelos (Proyectos, Tareas, Colaboradores).  
- 🎨 Frontend con Atomic Design y tablero tipo Kanban.  
- 🧩 Scripts y configuración compartida en `packages/`.  

## 📌 Notas

- El proyecto está en desarrollo y crecerá de forma incremental usando ramas (`feature/*`, `task/endpoint/*`, etc.).  
- Revisa la rama `main` para la última versión estable.
EOF
