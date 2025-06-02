import './Popup.css';
import React, { useState } from 'react';

const Popup = ({ children, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        {children}
        <button className="Popup-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;