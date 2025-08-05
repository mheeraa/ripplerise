import React, { useEffect } from 'react';

const MessageModal = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const modalTypeClass = type === 'error' ? 'message-error' : 'message-success';

  return (
    <div className="modal-overlay">
      <div className={`modal ${modalTypeClass}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default MessageModal;