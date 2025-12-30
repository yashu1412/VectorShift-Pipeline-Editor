import { useState, useEffect } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { Modal } from './components/Modal';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

function App() {
  const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    setAll: state.setAll,
  });
  const { nodes, edges, setAll } = useStore(selector, shallow);
  const selectionSelector = (state) => ({
    selectionNodes: state.selectionNodes,
    selectionEdges: state.selectionEdges,
    duplicateSelection: state.duplicateSelection,
    importNodesEdges: state.importNodesEdges,
  });
  const { selectionNodes, selectionEdges, duplicateSelection, importNodesEdges } = useStore(selectionSelector, shallow);
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    window.clearTimeout(triggerToast._t);
    triggerToast._t = window.setTimeout(() => setShowToast(false), 1800);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/pipelines/get?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.item) {
          setAll(data.item.nodes, data.item.edges);
        }
      } catch (e) {}
    })();
  }, [setAll]);

  const openHistory = async () => {
    setShowHistory(true);
    setIsLoadingHistory(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/pipelines/history');
      const data = await res.json();
      setHistoryItems(data.items || []);
    } catch (e) {
      setHistoryItems([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSave = async () => {
    if (!saveName.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/pipelines/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saveName.trim(), nodes, edges }),
      });
      const data = await res.json();
      setShowSave(false);
      setSaveName('');
      triggerToast('Saved');
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  const loadPipeline = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/pipelines/get?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.item) {
        setAll(data.item.nodes, data.item.edges);
        setShowHistory(false);
        triggerToast('Loaded');
      }
    } catch (e) {
    }
  };

  const deletePipeline = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/pipelines/delete?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const res = await fetch('http://127.0.0.1:8000/pipelines/history');
      const data = await res.json();
      setHistoryItems(data.items || []);
      triggerToast('Deleted');
    } catch (e) {
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 20px', 
        background: 'var(--bg-1)', 
        borderBottom: '1px solid var(--line-0)',
        boxSizing: 'border-box',
        animation: 'slideDownBlur 0.22s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-0)' }}>VectorShift</div>
          <div style={{ 
            padding: '4px 12px', 
            borderRadius: '999px', 
            border: '1px solid var(--line-0)', 
            color: 'var(--text-2)', 
            fontSize: '12px' 
          }}>
            Pipeline Editor
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <SubmitButton />
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div style={{ 
          width: '260px', 
          background: 'var(--bg-1)', 
          borderRight: '1px solid var(--line-0)', 
          display: 'flex', 
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <PipelineToolbar />
        </div>

        {/* Main Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <PipelineUI />
        </div>
        {/* Right Sidebar - Actions */}
        <div style={{ 
          width: '260px', 
          background: 'var(--bg-1)', 
          borderLeft: '1px solid var(--line-0)', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{ 
            fontSize: '13px', 
            color: 'var(--text-2)', 
            marginBottom: '12px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            fontWeight: '600'
          }}>
            Actions
          </div>
          <button className="primary-button" onClick={() => setShowSave(true)}>Save</button>
          <button className="primary-button" onClick={openHistory} style={{ background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--line-0)' }}>History</button>
          <button className="primary-button" onClick={async () => {
            try {
              const res = await fetch('http://127.0.0.1:8000/pipelines/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: saveName || 'Shared Pipeline', nodes, edges }),
              });
              const data = await res.json();
              const url = `${window.location.origin}?id=${encodeURIComponent(data.id)}`;
              setShareUrl(url);
              setShowShare(true);
              triggerToast('Share link created');
            } catch (e) {}
          }}>Share Link</button>
          <button className="primary-button" onClick={async () => {
            const payload = { nodes: selectionNodes, edges: selectionEdges };
            try {
              await navigator.clipboard.writeText(JSON.stringify(payload));
              triggerToast('Selection copied');
            } catch (e) {}
          }} style={{ background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--line-0)' }}>Copy Selection</button>
          <button className="primary-button" onClick={() => duplicateSelection({ x: 40, y: 40 })}>Duplicate Selection</button>
          <button className="primary-button" onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              const payload = JSON.parse(text);
              importNodesEdges(payload, { x: 40, y: 40 });
              triggerToast('Selection pasted');
            } catch (e) {}
          }} style={{ background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--line-0)' }}>Paste Selection</button>
          <button className="primary-button" onClick={() => {
            const payload = { nodes: selectionNodes, edges: selectionEdges };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pipeline-selection-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            triggerToast('Selection downloaded');
          }}>Download Selection</button>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ 
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-1)',
        borderTop: '1px solid var(--line-0)',
        fontSize: '12px',
        color: 'var(--text-2)'
      }}>
        <span>VectorShift Pipeline Editor © {new Date().getFullYear()} • Yashpalsingh Pawara</span>
      </div>

      <Modal 
        isOpen={showSave}
        onClose={() => setShowSave(false)}
        title="Save Pipeline"
        footer={
          <>
            <button className="primary-button" onClick={() => setShowSave(false)} style={{ background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--line-0)' }}>Cancel</button>
            <button className="primary-button" onClick={handleSave} disabled={isSaving} style={{ opacity: isSaving ? 0.7 : 1 }}>Save</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>Name</label>
          <input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="My Pipeline" />
        </div>
      </Modal>

      <Modal 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="History"
      >
        {isLoadingHistory ? (
          <div style={{ color: 'var(--text-2)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyItems.length === 0 && <div style={{ color: 'var(--text-2)' }}>No saved pipelines yet.</div>}
            {historyItems.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid var(--line-0)', borderRadius: '8px', background: 'var(--bg-1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--text-0)', fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: 'var(--text-2)', fontSize: '12px' }}>{item.timestamp}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-2)', fontSize: '12px' }}>{item.num_nodes} nodes • {item.num_edges} edges</span>
                  <button className="primary-button" onClick={() => loadPipeline(item.id)} style={{ background: 'var(--text-0)', color: 'var(--bg-0)' }}>Load</button>
                  <button className="primary-button" onClick={() => deletePipeline(item.id)} style={{ background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--line-0)' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
      
      <Modal 
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title="Share Pipeline"
        footer={
          <>
            <button className="primary-button" onClick={() => setShowShare(false)} style={{ background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--line-0)' }}>Close</button>
            <button className="primary-button" onClick={async () => {
              if (!shareUrl) return;
              try {
                await navigator.clipboard.writeText(shareUrl);
                triggerToast('URL copied');
              } catch (e) {}
            }} style={{ background: 'var(--text-0)', color: 'var(--bg-0)' }}>Copy</button>
            <button className="primary-button" onClick={async () => {
              if (!shareUrl) return;
              try {
                if (navigator.share) {
                  await navigator.share({ title: 'Pipeline', text: 'Open this shared pipeline', url: shareUrl });
                  triggerToast('Shared');
                } else {
                  await navigator.clipboard.writeText(shareUrl);
                  triggerToast('URL copied');
                }
              } catch (e) {}
            }}>Share</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>URL</label>
          <input type="text" value={shareUrl} readOnly />
        </div>
      </Modal>
      
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--bg-1)',
          color: 'var(--text-1)',
          border: '1px solid var(--line-0)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow)',
          padding: '10px 14px',
          zIndex: 1000,
          animation: 'slideInRight 0.2s ease-out'
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

export default App;
