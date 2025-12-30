// textNode.js

import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [handles, setHandles] = useState([{ type: 'source', position: Position.Right, id: 'output' }]);
  const [widthPx, setWidthPx] = useState(260);
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  const variableRegex = /{{([a-zA-Z_$][a-zA-Z0-9_$]*)}}/g;
  const variables = [...new Set([...currText.matchAll(variableRegex)].map(match => match[1]))];

  useEffect(() => {
    const newHandles = [
      { type: 'source', position: Position.Right, id: 'output' },
      ...variables.map((variable, index) => ({
        type: 'target',
        position: Position.Left,
        id: variable,
        style: { top: `${(index + 1) * 20 + 50}px` } // Offset for header + label
      }))
    ];
    
    setHandles(newHandles);
  }, [currText]); // Remove variables dependency to avoid loop if I added it, but here it's derived from currText so it's fine.

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const scrollW = el.scrollWidth + 40; // padding in node content
    const minW = 240;
    const maxW = 640;
    const next = Math.max(minW, Math.min(scrollW, maxW));
    setWidthPx(next);
  }, [currText]);

  return (
    <BaseNode
      id={id}
      title="Text"
      handles={handles}
      style={{ height: 'auto', width: `${widthPx}px` }}
    >
      <label>
        Text:
        <textarea 
          value={currText} 
          onChange={handleTextChange} 
          ref={textareaRef}
          style={{ 
             minHeight: '60px',
             resize: 'vertical'
          }}
        />
      </label>
      {variables.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {variables.map(v => (
            <span key={v} style={{ 
                background: 'var(--bg-3)', 
                color: 'var(--text-1)', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '11px',
                border: '1px solid var(--line-1)'
            }}>
                {v}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
}
