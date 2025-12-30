// toolbar.js
import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { IconInput, IconLLM, IconOutput, IconText, IconFilter, IconTransform, IconNote, IconAPI, IconDB, IconSearch } from './components/Icons';
import { Modal } from './components/Modal';

export const PipelineToolbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [showHelp, setShowHelp] = useState(false);

    const nodes = [
        { type: 'customInput', label: 'Input', icon: <IconInput />, category: 'Inputs' },
        { type: 'llm', label: 'LLM', icon: <IconLLM />, category: 'LLM' },
        { type: 'customOutput', label: 'Output', icon: <IconOutput />, category: 'Outputs' },
        { type: 'text', label: 'Text', icon: <IconText />, category: 'Text' },
        { type: 'filter', label: 'Filter', icon: <IconFilter />, category: 'Logic' },
        { type: 'transform', label: 'Transform', icon: <IconTransform />, category: 'Logic' },
        { type: 'note', label: 'Note', icon: <IconNote />, category: 'Utils' },
        { type: 'api', label: 'API', icon: <IconAPI />, category: 'Utils' },
        { type: 'database', label: 'DB', icon: <IconDB />, category: 'Utils' },
    ];

    const filteredNodes = nodes.filter(node => {
        const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'All' || 
                              (selectedFilter === 'Inputs' && node.category === 'Inputs') ||
                              (selectedFilter === 'Outputs' && node.category === 'Outputs') ||
                              (selectedFilter === 'LLM' && node.category === 'LLM') ||
                              (selectedFilter === 'Text' && node.category === 'Text');
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header + Filter Chips */}
            <div>
                <div style={{ 
                    fontSize: '13px', 
                    color: 'var(--text-2)', 
                    marginBottom: '12px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    fontWeight: '600'
                }}>
                    Nodes
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['All', 'Inputs', 'Outputs', 'LLM', 'Text'].map(filter => (
                        <div 
                            key={filter} 
                            onClick={() => setSelectedFilter(filter)}
                            style={{ 
                                padding: '4px 10px', 
                                borderRadius: '999px', 
                                background: selectedFilter === filter ? 'var(--text-0)' : 'var(--bg-1)', 
                                border: `1px solid ${selectedFilter === filter ? 'var(--text-0)' : 'var(--line-0)'}`, 
                                fontSize: '11px', 
                                color: selectedFilter === filter ? 'var(--bg-0)' : 'var(--text-1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                            {filter}
                        </div>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{ position: 'absolute', left: '12px', color: 'var(--text-3)' }}>
                    <IconSearch />
                </div>
                <input 
                    type="text" 
                    placeholder="Search nodes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        height: '36px',
                        paddingLeft: '34px',
                        paddingRight: '12px',
                        background: 'var(--bg-1)',
                        border: '1px solid var(--line-0)',
                        borderRadius: '8px',
                        color: 'var(--text-0)',
                        fontSize: '13px'
                    }}
                />
            </div>

            {/* Node List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredNodes.length > 0 ? (
                    filteredNodes.map(node => (
                        <DraggableNode key={node.type} type={node.type} label={node.label} icon={node.icon} />
                    ))
                ) : (
                    <div style={{ color: 'var(--text-2)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                        No nodes found.
                    </div>
                )}
            </div>

            {/* Footer Links */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--line-0)' }}>
                <div 
                    onClick={() => setShowHelp(true)}
                    style={{ color: 'var(--text-2)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <span style={{ textDecoration: 'underline' }}>Help & Documentation</span>
                </div>
            </div>

            {/* Help Modal */}
            <Modal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                title="How to use VectorShift"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <strong style={{ color: 'var(--text-0)' }}>1. Add Nodes</strong>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-2)' }}>Drag nodes from the sidebar onto the infinite canvas.</p>
                    </div>
                    <div>
                        <strong style={{ color: 'var(--text-0)' }}>2. Connect Nodes</strong>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-2)' }}>Drag from a source handle (right) to a target handle (left) to create a pipeline.</p>
                    </div>
                    <div>
                        <strong style={{ color: 'var(--text-0)' }}>3. Variables</strong>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-2)' }}>In the Text Node, type <code style={{ background: 'var(--bg-2)', padding: '2px 4px', borderRadius: '4px' }}>&#123;&#123;variable&#125;&#125;</code> to dynamically create new input handles.</p>
                    </div>
                    <div>
                        <strong style={{ color: 'var(--text-0)' }}>4. Submit Pipeline</strong>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-2)' }}>Click the "Submit" button in the top right to validate your pipeline architecture.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
