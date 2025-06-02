import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "./menu.css"
import Popup from "./Popup"

export default function PositionedMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [showPopup, setShowPopup] = useState(false);

    const handleOpenPopup = (itemId) => {
        setShowPopup(itemId);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };
    return (
    <div className="menu-style">
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
       Menu 
      </Button>
      <Menu 
        id="fade-menu"
        MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={()=>handleOpenPopup(1)}>How It Works</MenuItem>
        {showPopup===1 && (
        <Popup onClose={handleClosePopup}>
          <h2>How It Works</h2>
          <p>The AI architecture of this project is a Multi-Agent Collaboration wrapped in a Retrival-Augmentation-Generation (RAG) structure.</p>
          <p>In english terms: it uses a variety of Large Language Models instead of one, boils down information to one model (Ugin) and then learns based on their output.</p>
          <p>Information is pulled directly from WOTC comprehensive rules and Scryfall.</p>
        </Popup>
        )}
        <MenuItem onClick={()=>handleOpenPopup(2)}>Contact</MenuItem>
        {showPopup===2 && (
        <Popup onClose={handleClosePopup}>
          <h2>Contact</h2>
          <p>This project was developed by myself, A Robotic/AI Engineer, who is terrible at web development.</p>
          <p> So if there is any issues whatsoever do not hesitate to reach out:</p>
        </Popup>
        )}
        <MenuItem onClick={()=>handleOpenPopup(3)}>Legal</MenuItem>
        {showPopup===3 && (
        <Popup onClose={handleClosePopup}>
          <h2>Legal</h2>
          <p>&copy; 2023 Key Instincts</p>
            <p>Wizards of the Coast, Magic: The Gathering, and their logos are trademarks of Wizards of the Coast LLC in the United States and other countries. © 1993-2024 Wizards. All Rights Reserved.</p>
            <p>Key Instincts LLC is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. Key Instincts LLC may use the trademarks and other intellectual property of Wizards of the Coast LLC, which is permitted under Wizards&apos; Fan Site Policy. MAGIC: THE GATHERING® is a trademark of Wizards of the Coast. For more information about Wizards of the Coast or any of Wizards&apos; trademarks or other intellectual property, please visit their website at https://company.wizards.com/.</p>
            
        </Popup>
        )}

      </Menu>
    </div>
  );
}