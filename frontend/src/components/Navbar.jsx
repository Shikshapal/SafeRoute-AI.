import React, { useState } from 'react';
import { Shield, Navigation, AlertTriangle, MessageSquare, BookOpen, Users, Menu, X, PhoneCall } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onTriggerSos }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'planner', label: 'Route Planner', icon: Navigation },
    { id: 'sos', label: 'SOS Emergency', icon: AlertTriangle },
    { id: 'ai-chat', label: 'AI Safety Chat', icon: MessageSquare },
    { id: 'tips', label: 'Safety Tips', icon: BookOpen },
    { id: 'contacts', label: 'Helplines & Contacts', icon: Users },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => handleNavClick('home')}>
          <div className="logo-icon-box">
            <Shield size={22} />
          </div>
          <div>
            <div className="brand-title">
              SafeRoute <span className="text-gradient-purple-pink">AI</span>
              <span className="brand-badge">24/7 Safety</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComponent size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action: Quick SOS Emergency Trigger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="nav-sos-btn pulse-sos" 
            onClick={onTriggerSos}
            title="Instant SOS Emergency Activation"
          >
            <PhoneCall size={16} />
            <span>SOS 112</span>
          </button>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

