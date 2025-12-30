
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');

  return (
    <BaseNode
      id={id}
      title="API Request"
      handles={[
        { type: 'target', position: Position.Left, id: 'trigger' },
        { type: 'source', position: Position.Right, id: 'response' }
      ]}
    >
      <label>
        Method:
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
      <label>
        URL:
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
    </BaseNode>
  );
}
