import React from 'react';
import type { IconType } from 'react-icons';
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';
import './Footer.css';

const footerLinks: { href: string; Icon: IconType; label: string }[] = [
  { href: '#', Icon: FiGithub, label: 'GitHub' },
  { href: '#', Icon: FiTwitter, label: 'Twitter' },
  { href: '#', Icon: FiMail, label: 'Contact' },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        {footerLinks.map((link, index) => (
          <a key={index} href={link.href} className="footer-link" target="_blank" rel="noopener noreferrer">
            <span className="footer-link-icon"><link.Icon /></span>
            <span className="footer-link-label">{link.label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
