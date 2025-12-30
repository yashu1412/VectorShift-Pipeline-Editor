import { Handle, Position } from 'reactflow';
import { IconX } from '../components/Icons';
import { useStore } from '../store';

export const BaseNode = ({ id, data, title, children, handles = [], style = {} }) => {
  const deleteNode = useStore((state) => state.deleteNode);

  const onDelete = () => {
    deleteNode(id);
  };

  return (
    <div className="blackglass-node" style={style}>
      <div className="blackglass-node-header">
        {/* Type Chip - simplified as text for now, or icon */}
        <span style={{ 
            textTransform: 'uppercase', 
            fontSize: '11px', 
            color: 'var(--text-2)',
            fontWeight: '600',
            letterSpacing: '0.05em'
        }}>
            {/* Could derive from title or props */}
        </span>
        
        {/* Title */}
        <span style={{ flex: 1, color: 'var(--text-0)', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</span>
        
        {/* Actions */}
        <button 
            onClick={onDelete}
            style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--text-2)', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '4px',
                borderRadius: '4px'
            }}
            className="node-action-btn"
        >
            <IconX />
        </button>
      </div>
      <div className="blackglass-node-content">
        {children}
      </div>
      
      {handles.map((handle, index) => (
        <Handle
          key={index}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          style={{
            ...handle.style
          }}
        />
      ))}
    </div>
  );
};
