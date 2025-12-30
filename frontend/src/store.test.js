import { useStore } from './store';

describe('store selection operations', () => {
  beforeEach(() => {
    useStore.setState({
      nodes: [],
      edges: [],
      nodeIDs: {},
      selectionNodes: [],
      selectionEdges: [],
    });
  });

  test('duplicateSelection clones nodes and edges with offset', () => {
    useStore.setState({
      nodes: [
        { id: 'text-1', type: 'text', position: { x: 0, y: 0 }, data: { id: 'text-1' } },
        { id: 'text-2', type: 'text', position: { x: 100, y: 0 }, data: { id: 'text-2' } },
      ],
      edges: [
        { id: 'e1', source: 'text-1', target: 'text-2' },
      ],
      selectionNodes: [
        { id: 'text-1', type: 'text', position: { x: 0, y: 0 }, data: { id: 'text-1' } },
        { id: 'text-2', type: 'text', position: { x: 100, y: 0 }, data: { id: 'text-2' } },
      ],
      selectionEdges: [
        { id: 'e1', source: 'text-1', target: 'text-2' },
      ],
      nodeIDs: { text: 2 },
    });

    useStore.getState().duplicateSelection({ x: 40, y: 40 });
    const st = useStore.getState();
    expect(st.nodes.length).toBe(4);
    expect(st.edges.length).toBe(2);
    const newNodes = st.nodes.filter(n => n.id !== 'text-1' && n.id !== 'text-2');
    expect(newNodes.every(n => n.position.x >= 40 && n.position.y >= 40)).toBe(true);
  });

  test('importNodesEdges remaps ids and applies offset', () => {
    useStore.setState({
      nodes: [],
      edges: [],
      nodeIDs: { text: 0 },
    });
    const payload = {
      nodes: [
        { id: 'a', type: 'text', position: { x: 10, y: 10 }, data: { id: 'a' } },
        { id: 'b', type: 'text', position: { x: 30, y: 10 }, data: { id: 'b' } },
      ],
      edges: [
        { id: 'eab', source: 'a', target: 'b' },
      ],
    };
    useStore.getState().importNodesEdges(payload, { x: 50, y: 50 });
    const st = useStore.getState();
    expect(st.nodes.length).toBe(2);
    const ids = st.nodes.map(n => n.id);
    expect(ids).not.toContain('a');
    expect(ids).not.toContain('b');
    const pos = st.nodes.map(n => n.position);
    expect(pos[0].x).toBeGreaterThanOrEqual(60);
    expect(pos[0].y).toBeGreaterThanOrEqual(60);
    expect(st.edges.length).toBe(1);
    const e = st.edges[0];
    expect(ids).toContain(e.source);
    expect(ids).toContain(e.target);
  });

  test('setAll reconstructs nodeIDs counters from node ids', () => {
    const nodes = [
      { id: 'text-5', type: 'text', position: { x: 0, y: 0 }, data: {} },
      { id: 'text-2', type: 'text', position: { x: 0, y: 0 }, data: {} },
      { id: 'llm-3', type: 'llm', position: { x: 0, y: 0 }, data: {} },
    ];
    useStore.getState().setAll(nodes, []);
    const st = useStore.getState();
    expect(st.nodeIDs.text).toBe(5);
    expect(st.nodeIDs.llm).toBe(3);
    expect(st.nodes.length).toBe(3);
  });

  test('duplicateSelection only duplicates edges between selected nodes', () => {
    useStore.setState({
      nodes: [
        { id: 'text-1', type: 'text', position: { x: 0, y: 0 }, data: {} },
        { id: 'text-2', type: 'text', position: { x: 100, y: 0 }, data: {} },
        { id: 'text-3', type: 'text', position: { x: 200, y: 0 }, data: {} },
      ],
      edges: [
        { id: 'e12', source: 'text-1', target: 'text-2' },
        { id: 'e23', source: 'text-2', target: 'text-3' },
      ],
      selectionNodes: [
        { id: 'text-1', type: 'text', position: { x: 0, y: 0 }, data: {} },
        { id: 'text-2', type: 'text', position: { x: 100, y: 0 }, data: {} },
      ],
      selectionEdges: [
        { id: 'e12', source: 'text-1', target: 'text-2' },
        { id: 'e23', source: 'text-2', target: 'text-3' },
      ],
      nodeIDs: { text: 3 },
    });
    useStore.getState().duplicateSelection({ x: 10, y: 10 });
    const st = useStore.getState();
    const newEdges = st.edges.slice(2);
    expect(newEdges.length).toBe(1);
    const e = newEdges[0];
    const newIds = st.nodes.slice(3).map(n => n.id);
    expect(newIds).toContain(e.source);
    expect(newIds).toContain(e.target);
  });
});
