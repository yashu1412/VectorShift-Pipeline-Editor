
import { IconX } from './Icons';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.15s ease-out'
        }} onClick={onClose}>
            <div style={{
                width: '560px',
                background: 'var(--bg-1)',
                border: '1px solid var(--line-0)',
                borderRadius: '20px',
                boxShadow: 'var(--shadow)',
                padding: '24px',
                animation: 'popModal 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                transformOrigin: 'center center'
            }} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text-0)', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-2)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex'
                        }}
                    >
                        <IconX />
                    </button>
                </div>

                {/* Body */}
                <div style={{ color: 'var(--text-1)', fontSize: '15px', lineHeight: '1.5' }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
