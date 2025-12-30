// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    selectionNodes: [],
    selectionEdges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    setAll: (nodes, edges) => {
        const counts = {};
        for (const n of nodes || []) {
            const parts = String(n.id).split('-');
            const t = parts[0];
            const num = Number(parts[1] || 0);
            counts[t] = Math.max(counts[t] || 0, isNaN(num) ? 0 : num);
        }
        set({
            nodes: nodes || [],
            edges: edges || [],
            nodeIDs: counts
        });
    },
    setSelection: (nodes, edges) => {
        set({
            selectionNodes: nodes || [],
            selectionEdges: edges || [],
        });
    },
    deleteNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
    duplicateSelection: (offset = { x: 40, y: 40 }) => {
      const { selectionNodes, selectionEdges, getNodeID, nodes, edges } = get();
      if (!selectionNodes || selectionNodes.length === 0) return;
      const idMap = {};
      const newNodes = selectionNodes.map((n) => {
        const newId = getNodeID(n.type);
        idMap[n.id] = newId;
        return {
          ...n,
          id: newId,
          position: { x: n.position.x + (offset.x || 0), y: n.position.y + (offset.y || 0) },
          data: { ...n.data, id: newId },
        };
      });
      const selectedIds = new Set(selectionNodes.map(n => n.id));
      const newEdges = (selectionEdges || [])
        .filter((e) => selectedIds.has(e.source) && selectedIds.has(e.target))
        .map((e) => ({
          ...e,
          id: `${idMap[e.source]}-${idMap[e.target]}-${Math.random().toString(36).slice(2,7)}`,
          source: idMap[e.source],
          target: idMap[e.target],
        }));
      set({
        nodes: [...nodes, ...newNodes],
        edges: [...edges, ...newEdges],
      });
    },
    importNodesEdges: (payload, offset = { x: 40, y: 40 }) => {
      try {
        const { nodes, edges } = payload || {};
        if (!Array.isArray(nodes)) return;
        const idMap = {};
        const existingIds = new Set(get().nodes.map(n => n.id));
        const newNodes = nodes.map((n) => {
          let newId = get().getNodeID(n.type);
          while (newId === n.id || existingIds.has(newId)) {
            newId = get().getNodeID(n.type);
          }
          idMap[n.id] = newId;
          const pos = n.position || { x: 0, y: 0 };
          return {
            ...n,
            id: newId,
            position: { x: pos.x + (offset.x || 0), y: pos.y + (offset.y || 0) },
            data: { ...n.data, id: newId },
          };
        });
        const newEdges = (edges || [])
          .filter((e) => idMap[e.source] && idMap[e.target])
          .map((e) => ({
            ...e,
            id: `${idMap[e.source]}-${idMap[e.target]}-${Math.random().toString(36).slice(2,7)}`,
            source: idMap[e.source],
            target: idMap[e.target],
          }));
        set({
          nodes: [...get().nodes, ...newNodes],
          edges: [...get().edges, ...newEdges],
        });
      } catch (err) {
      }
    },
  }));
