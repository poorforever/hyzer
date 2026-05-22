import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FiHome, FiSettings, FiUser, FiMessageSquare, FiBarChart2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Sidebar.css';

const navItems: { to: string; Icon: IconType; label: string }[] = [
  { to: '/', Icon: FiHome, label: 'Home' },
  { to: '/messages', Icon: FiMessageSquare, label: 'Messages' },
  { to: '/analytics', Icon: FiBarChart2, label: 'Analytics' },
  { to: '/profile', Icon: FiUser, label: 'Profile' },
  { to: '/settings', Icon: FiSettings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button className="sidebar-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><item.Icon /></span>
              {expanded && <span className="sidebar-label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
