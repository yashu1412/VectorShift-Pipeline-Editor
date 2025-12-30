// llmNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'GPT-4o');
  const [maxTokens, setMaxTokens] = useState(data?.maxTokens || 2048);
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'model', model);
  }, [model]);

  useEffect(() => {
    updateNodeField(id, 'maxTokens', maxTokens);
  }, [maxTokens]);

  return (
    <BaseNode
      id={id}
      title="LLM"
      handles={[
        { type: 'target', position: Position.Left, id: 'system', style: { top: `${100/3}%` } },
        { type: 'target', position: Position.Left, id: 'prompt', style: { top: `${200/3}%` } },
        { type: 'source', position: Position.Right, id: 'response' }
      ]}
    >
      <div style={{ fontSize: '12px', color: 'var(--text-1)' }}>
         <div style={{ marginBottom: '8px' }}>
             <span style={{ color: 'var(--text-2)', display: 'block', marginBottom: '4px' }}>Model</span>
             <select style={{ width: '100%' }} value={model} onChange={(e) => setModel(e.target.value)}>
                 <option>GPT-4o</option>
                 <option>GPT-3.5 Turbo</option>
                 <option>Claude 3.5 Sonnet</option>
             </select>
         </div>
         <div>
             <span style={{ color: 'var(--text-2)', display: 'block', marginBottom: '4px' }}>Max Tokens</span>
             <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value) || 0)} style={{ width: '100%' }} />
         </div>
      </div>
    </BaseNode>
  );
}
