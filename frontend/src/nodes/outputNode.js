// outputNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  useEffect(() => {
    updateNodeField(id, 'outputName', currName);
  }, [currName]);

  useEffect(() => {
    updateNodeField(id, 'outputType', outputType);
  }, [outputType]);

  return (
    <BaseNode
      id={id}
      title="Output"
      handles={[
        { type: 'target', position: Position.Left, id: 'value' }
      ]}
    >
      <label>
        Name:
        <input 
          type="text" 
          value={currName} 
          onChange={handleNameChange} 
        />
      </label>
      <label>
        Type:
        <select 
          value={outputType} 
          onChange={handleTypeChange}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
}
