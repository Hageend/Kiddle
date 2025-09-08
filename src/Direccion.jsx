// FullScreenModal.jsx
import React from 'react';
import './carrito.css';

function Direccion({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Direccion;
