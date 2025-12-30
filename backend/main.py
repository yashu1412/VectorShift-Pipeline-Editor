
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import json
from uuid import uuid4
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class SaveRequest(PipelineData):
    name: str

HISTORY_FILE = os.path.join(os.path.dirname(__file__), "history.json")

def _load_history() -> List[Dict[str, Any]]:
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def _write_history(records: List[Dict[str, Any]]) -> None:
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineData):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    
    # Check DAG
    adj = {node['id']: [] for node in pipeline.nodes}
    for edge in pipeline.edges:
        source = edge['source']
        target = edge['target']
        if source in adj:
            adj[source].append(target)
            
    is_dag = check_is_dag(adj)
    
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}

@app.post('/pipelines/save')
def save_pipeline(req: SaveRequest):
    records = _load_history()
    record_id = str(uuid4())
    timestamp = datetime.utcnow().isoformat() + "Z"
    record = {
        "id": record_id,
        "name": req.name.strip() or f"Untitled-{record_id[:8]}",
        "timestamp": timestamp,
        "nodes": req.nodes,
        "edges": req.edges,
        "num_nodes": len(req.nodes),
        "num_edges": len(req.edges),
    }
    records.append(record)
    _write_history(records)
    return {"ok": True, "id": record_id, "timestamp": timestamp, "name": record["name"], "num_nodes": record["num_nodes"], "num_edges": record["num_edges"]}

@app.get('/pipelines/history')
def history():
    records = _load_history()
    summaries = [
        {
            "id": r.get("id"),
            "name": r.get("name"),
            "timestamp": r.get("timestamp"),
            "num_nodes": r.get("num_nodes"),
            "num_edges": r.get("num_edges"),
        }
        for r in records
    ]
    return {"items": summaries}

@app.get('/pipelines/get')
def get_pipeline(id: str):
    records = _load_history()
    for r in records:
        if r.get("id") == id:
            return {"item": r}
    return {"item": None}

@app.delete('/pipelines/delete')
def delete_pipeline(id: str):
    records = _load_history()
    new_records = [r for r in records if r.get("id") != id]
    _write_history(new_records)
    return {"ok": True, "deleted": id}

def check_is_dag(adj):
    visited = set()
    recursion_stack = set()
    
    def has_cycle(node):
        visited.add(node)
        recursion_stack.add(node)
        
        for neighbor in adj.get(node, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in recursion_stack:
                return True
        
        recursion_stack.remove(node)
        return False
    
    for node in adj:
        if node not in visited:
            if has_cycle(node):
                return False # Cycle found
                
    return True # No cycle

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
