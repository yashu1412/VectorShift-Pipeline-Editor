# VectorShift Pipeline Editor

## Live Link
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000

## What Is This Project
- A visual pipeline builder to design, validate, save, and share data/AI workflows as Directed Acyclic Graphs (DAGs).
- Drag nodes such as Input, Text, Transform, Filter, LLM, API, Database, Output, and Note onto an infinite canvas, connect them, and validate with the backend.
- Save pipelines, load from history, and generate shareable links tied to backend storage.

## What It’s Used For
- Rapid prototyping of data processing and AI workflows.
- Teaching DAG concepts and visualizing dependencies.
- Creating shareable workflow blueprints with local persistence.

## Tech Stack
- Frontend: React 18, ReactFlow, Zustand, CRA tooling
- Backend: FastAPI, Uvicorn, Pydantic
- Testing: React Testing Library, Jest (via CRA)

## Quick Start
1. Prerequisites: Node.js 16+, Python 3.11+
2. Backend:
   - Create venv and install:
     - `python -m venv .venv && .\.venv\Scripts\Activate.ps1`
     - `pip install -r ../backend/requirements.txt` (run from frontend or adjust path)
   - Run API:
     - `python ../backend/main.py` (Uvicorn serves FastAPI at http://127.0.0.1:8000)
3. Frontend:
   - `npm install`
   - `npm start`
4. Open the app at http://localhost:3000

## How To Use
- Add nodes: drag from the left sidebar.
- Connect nodes: drag from right (source) handle to left (target) handle.
- Variables in Text node: use `{{variable}}` to auto-create input handles.
- Validate: click Submit to send the graph to `/pipelines/parse` and see node/edge counts plus DAG validity.
- Save/History: use Actions on the right to save, view history, load, delete.
- Share Link: creates a URL with `?id=...` to load a saved pipeline.
- Copy/Paste Selection: copy selection to clipboard, paste from clipboard into canvas.

## API Endpoints
- `GET /` → health
- `POST /pipelines/parse` → `{ num_nodes, num_edges, is_dag }`
- `POST /pipelines/save` → persist `{ name, nodes, edges }` and return `{ id, timestamp }`
- `GET /pipelines/history` → list saved pipelines
- `GET /pipelines/get?id=...` → retrieve a pipeline by id
- `DELETE /pipelines/delete?id=...` → delete by id

## Project Structure
- Backend: `../backend` (FastAPI + persistence in `history.json`)
- Frontend: this folder (ReactFlow graph editor, state in `store.js`)

## Scripts
- Frontend:
  - `npm start` → dev server at http://localhost:3000
  - `npm test` → run tests
  - `npm run build` → production build
  - `npm run eject` → CRA eject (not recommended)
