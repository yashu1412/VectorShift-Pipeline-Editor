
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || '');

  return (
    <BaseNode
      id={id}
      title="Note"
      handles={[]}
    >
      <textarea 
        value={note} 
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your note here..."
        style={{ 
          minHeight: '60px',
          resize: 'vertical'
        }}
      />
    </BaseNode>
  );
}
