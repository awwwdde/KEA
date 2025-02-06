import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser , FaCog } from 'react-icons/fa';
import './menu.scss';

const Menu = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-item">
      <div className="icon-container">
        <FaHome />
      </div>
      </Link>
      <Link to="/options" className="sidebar-item">
      <div className="icon-container">
        <FaCog />
      </div>
      </Link>
    </div>
  );
};

export default Menu;