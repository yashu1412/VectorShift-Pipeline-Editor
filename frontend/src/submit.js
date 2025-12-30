
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { Modal } from './components/Modal';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const [modalOpen, setModalOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
            setModalOpen(true);
        } catch (error) {
            console.error("Error submitting pipeline:", error);
            // Optional: Show error modal
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="primary-button"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </div>

            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)}
                title="Pipeline Results"
                footer={
                    <button onClick={() => setModalOpen(false)} className="primary-button" style={{ background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--line-0)' }}>
                        Close
                    </button>
                }
            >
                {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--text-2)' }}>Number of Nodes:</span>
                            <span style={{ fontWeight: '600', color: 'var(--text-0)' }}>{result.num_nodes}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--text-2)' }}>Number of Edges:</span>
                            <span style={{ fontWeight: '600', color: 'var(--text-0)' }}>{result.num_edges}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--text-2)' }}>Is DAG:</span>
                            <span style={{ 
                                fontWeight: '600', 
                                color: result.is_dag ? 'var(--text-0)' : 'var(--warn)' 
                            }}>
                                {result.is_dag ? 'Yes' : 'No'}
                            </span>
                        </div>
                        {!result.is_dag && (
                            <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg-0)', border: '1px solid var(--line-0)', borderRadius: '8px', fontSize: '13px', color: 'var(--warn)' }}>
                                Warning: The pipeline contains cycles and is not a valid Directed Acyclic Graph (DAG).
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}
