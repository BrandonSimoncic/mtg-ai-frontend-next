'use client';

import { useState, useRef, useEffect } from 'react';
import Popup from '../Popup';
import '../menu.css';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenPopup = (itemId) => {
    setShowPopup(itemId);
    setIsOpen(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="menu-container" ref={menuRef}>
      <button 
        className="menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="menu-content"
      >
        Menu
      </button>
      
      {isOpen && (
        <div className="menu-content" id="menu-content">
          <button 
            className="menu-item"
            onClick={() => handleOpenPopup(1)}
          >
            How It Works
          </button>
          <button 
            className="menu-item"
            onClick={() => handleOpenPopup(2)}
          >
            Contact
          </button>
          <button 
            className="menu-item"
            onClick={() => handleOpenPopup(3)}
          >
            Legal
          </button>
        </div>
      )}

      {showPopup === 1 && (
        <Popup onClose={handleClosePopup}>
          <h2>How It Works</h2>
          <p>The AI architecture of this project is a Multi-Agent Collaboration wrapped in a Retrival-Augmentation-Generation (RAG) structure.</p>
          <p>In english terms: it uses a variety of Large Language Models instead of one, boils down information to one model (Ugin) and then learns based on their output.</p>
          <p>Information is pulled directly from WOTC comprehensive rules and Scryfall.</p>
        </Popup>
      )}

      {showPopup === 2 && (
        <Popup onClose={handleClosePopup}>
          <h2>Contact</h2>
          <p>This project was developed by myself, A Robotic/AI Engineer, who is terrible at web development.</p>
          <p>So if there is any issues whatsoever do not hesitate to reach out: <a href="mailto:ContactUs@KeyInstincts.net">ContactUs@KeyInstincts.net</a></p>
        </Popup>
      )}

      {showPopup === 3 && (
        <Popup onClose={handleClosePopup}>
          <h2>Legal</h2>
          <p>&copy; 2023 Key Instincts</p>
          <p>Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2024 Wizards. All Rights Reserved.</p>
          <p>Key Instincts LLC is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. Key Instincts LLC may use the trademarks and other intellectual property of Wizards of the Coast LLC, which is permitted under Wizards&apos; Fan Site Policy. MAGIC: THE GATHERING® is a trademark of Wizards of the Coast. For more information about Wizards of the Coast or any of Wizards&apos; trademarks or other intellectual property, please visit their website at https://company.wizards.com/.</p>
        </Popup>
      )}
    </div>
  );
} 