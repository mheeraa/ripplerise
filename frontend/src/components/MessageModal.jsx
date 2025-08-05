import React, { useEffect } from 'react';

const MessageModal = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [duration, onClose]);

  const modalTypeClass = type === 'error' ? 'message-error' : 'message-success';

  return (
    <div className="modal-overlay">
      <div className={`modal ${modalTypeClass}`}>
        <p>{message}</p>
        {/* Optional: Add a dismiss button if you want user to manually close */}
        {/* <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: 'var(--spacing-md)' }}>
          Dismiss
        </button> */}
      </div>
    </div>
  );
};

export default MessageModal;