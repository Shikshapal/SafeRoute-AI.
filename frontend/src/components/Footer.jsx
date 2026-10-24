import React from 'react';
import { Shield, Heart, ExternalLink, AlertCircle } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="footer">
      <div className="container">
        {/* Emergency Quick Bar inside Footer */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#ef4444" />
            <span style={{ fontWeight: '700', color: '#fca5a5' }}>
              Immediate Emergency? Call Unified Emergency 112 or Women Helpline 1091
            </span>
          </div>
          <a
            href="tel:112"
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}
          >
            Dial 112 Now
          </a>
        </div>

        <div className="footer-content">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Shield size={18} color="#ec4899" />
              <span style={{ fontWeight: '800', color: 'white', fontSize: '1.05rem' }}>SafeRoute AI</span>
              <span style={{ color: 'var(--text-muted)' }}>– Your Safety, Your Journey.</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '540px' }}>
              SafeRoute AI is built for hackathons to demonstrate ethical, transparent, and technology-empowered women's safety navigation. All route calculations utilize open OpenStreetMap and OSRM infrastructure.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: '700', color: 'white', marginBottom: '8px', fontSize: '0.85rem' }}>Features</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <button onClick={() => { setActivePage('planner'); window.scrollTo({ top: 0, behavior: 'smooth'}); }} style={{ background: 'none', color: 'var(--text-muted)', textAlign: 'left' }}>Route Planner</button>
                <button onClick={() => { setActivePage('sos'); window.scrollTo({ top: 0, behavior: 'smooth'}); }} style={{ background: 'none', color: 'var(--text-muted)', textAlign: 'left' }}>SOS Assistant</button>
                <button onClick={() => { setActivePage('ai-chat'); window.scrollTo({ top: 0, behavior: 'smooth'}); }} style={{ background: 'none', color: 'var(--text-muted)', textAlign: 'left' }}>AI Companion</button>
                <button onClick={() => { setActivePage('contacts'); window.scrollTo({ top: 0, behavior: 'smooth'}); }} style={{ background: 'none', color: 'var(--text-muted)', textAlign: 'left' }}>Emergency Contacts</button>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: '700', color: 'white', marginBottom: '8px', fontSize: '0.85rem' }}>Helplines (India)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <a href="tel:112" style={{ color: '#f472b6' }}>112 – Unified Emergency</a>
                <a href="tel:1091" style={{ color: '#c084fc' }}>1091 – Women Helpline</a>
                <a href="tel:181" style={{ color: 'var(--text-muted)' }}>181 – Domestic Distress</a>
                <a href="tel:1930" style={{ color: 'var(--text-muted)' }}>1930 – Cyber Crime</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            Built with <Heart size={12} color="#ec4899" style={{ display: 'inline', margin: '0 2px' }} /> for Women Safety Innovation
          </div>
          <div>
            Zero Fabricated Crime Scores • Local Storage Only • Respects User Consent
          </div>
        </div>
      </div>
    </footer>
  );
}

