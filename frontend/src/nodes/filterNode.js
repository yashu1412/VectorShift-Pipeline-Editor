
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  return (
    <BaseNode
      id={id}
      title="Filter"
      handles={[
        { type: 'target', position: Position.Left, id: 'input' },
        { type: 'source', position: Position.Right, id: 'true' },
        { type: 'source', position: Position.Right, id: 'false', style: { top: '70%' } }
      ]}
    >
      <label>
        Condition:
        <select 
          value={condition} 
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="starts_with">Starts With</option>
        </select>
      </label>
      <label>
        Value:
        <input 
          type="text" 
          value={filterValue} 
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </label>
    </BaseNode>
  );
}
