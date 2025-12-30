import { useStore } from './store';

export const DraggableNode = ({ type, label, icon }) => {
    const addNode = useStore((state) => state.addNode);
    const getNodeID = useStore((state) => state.getNodeID);

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = () => {
        const nodeID = getNodeID(type);
        const newNode = {
            id: nodeID,
            type,
            position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
            data: { id: nodeID, nodeType: `${type}` },
        };
        addNode(newNode);
    };
  
    return (
      <div
        className="sidebar-node"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        onClick={handleClick}
        draggable
      >
          <div style={{ color: 'var(--text-1)' }}>
            {icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-0)' }}>{label}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>Drag or Click to add</span>
          </div>
      </div>
    );
  };
