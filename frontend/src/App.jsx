import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SosConfirmationModal from './components/SosConfirmationModal';
import Home from './pages/Home';
import RoutePlanner from './pages/RoutePlanner';
import SosEmergency from './pages/SosEmergency';
import AiSafetyChat from './pages/AiSafetyChat';
import EmergencyContacts from './pages/EmergencyContacts';
import SafetyTips from './pages/SafetyTips';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  const handleTriggerSos = () => {
    setIsSosModalOpen(true);
  };

  return (
    <div className="app-wrapper">
      {/* Global Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onTriggerSos={handleTriggerSos}
      />

      {/* Main Page Body */}
      <main className="main-content" style={{ marginTop: '24px' }}>
        {activePage === 'home' && (
          <Home
            setActivePage={setActivePage}
            onTriggerSos={handleTriggerSos}
          />
        )}
        {activePage === 'planner' && (
          <RoutePlanner
            onTriggerSos={handleTriggerSos}
          />
        )}
        {activePage === 'sos' && (
          <SosEmergency
            setActivePage={setActivePage}
          />
        )}
        {activePage === 'ai-chat' && (
          <AiSafetyChat
            setActivePage={setActivePage}
            onTriggerSos={handleTriggerSos}
          />
        )}
        {activePage === 'tips' && (
          <SafetyTips
            setActivePage={setActivePage}
            onTriggerSos={handleTriggerSos}
          />
        )}
        {activePage === 'contacts' && (
          <EmergencyContacts
            onTriggerSos={handleTriggerSos}
          />
        )}
      </main>

      {/* Global SOS Emergency Confirmation Modal */}
      <SosConfirmationModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer
        setActivePage={setActivePage}
      />
    </div>
  );
}

