import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, MapPin, Copy, Check, MessageSquare, Send, X, ShieldAlert, Navigation } from 'lucide-react';
import { storage } from '../services/storage';

export default function SosConfirmationModal({ isOpen, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | fetching | success | denied | error
  const [coords, setCoords] = useState(null);
  const [copied, setCopied] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState('call'); // call | message

  useEffect(() => {
    if (isOpen) {
      setContacts(storage.getContacts());
      setLocationStatus('idle');
      setCoords(null);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Request location with explicit user action
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationStatus('success');
      },
      (error) => {
        console.warn('Geolocation denied or failed:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
        } else {
          setLocationStatus('error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const emergencyMessage = storage.generateSosMessage(coords, customNote);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(emergencyMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={22} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f87171' }}>SOS Emergency Protocol</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confirm your action before proceeding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-dim)', padding: '6px' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch between Call Helplines and Share Location Alert */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '18px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('call')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.85rem',
              background: activeTab === 'call' ? 'var(--status-danger)' : 'transparent',
              color: activeTab === 'call' ? 'white' : 'var(--text-muted)'
            }}
          >
            1. Call Emergency (112)
          </button>
          <button
            onClick={() => setActiveTab('message')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.85rem',
              background: activeTab === 'message' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'message' ? 'white' : 'var(--text-muted)'
            }}
          >
            2. Send SOS Message
          </button>
        </div>

        {/* TAB 1: ONE CLICK DIAL CALLS */}
        {activeTab === 'call' && (
          <div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px',
              fontSize: '0.85rem',
              color: '#fca5a5'
            }}>
              <strong>Immediate Intervention:</strong> Clicking below will launch your phone's native dialer to place a call directly.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <a
                href="tel:112"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-danger)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <PhoneCall size={24} />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>Call 112 – National Emergency</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Unified Police, Ambulance, Fire (All India)</div>
                  </div>
                </div>
                <span style={{
                  background: 'white',
                  color: '#dc2626',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '800',
                  fontSize: '0.85rem'
                }}>
                  TAP TO DIAL
                </span>
              </a>

              <a
                href="tel:1091"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-accent)',
                  color: 'white',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <PhoneCall size={20} color="#f472b6" />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Call 1091 – Women Helpline</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>24/7 Police Dispatch for Women</div>
                  </div>
                </div>
                <span style={{ color: '#f472b6', fontWeight: '700', fontSize: '0.8rem' }}>
                  DIAL 1091 →
                </span>
              </a>
            </div>

            <button
              onClick={() => setActiveTab('message')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Need to share your location with contacts instead?</span>
              <Send size={14} />
            </button>
          </div>
        )}

        {/* TAB 2: COMPOSE & SEND LOCATION ALERT */}
        {activeTab === 'message' && (
          <div>
            {/* Geolocation status bar */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <MapPin size={18} color={coords ? '#10b981' : '#f59e0b'} />
                <div>
                  {locationStatus === 'idle' && 'Location not attached yet.'}
                  {locationStatus === 'fetching' && 'Accessing GPS coordinates...'}
                  {locationStatus === 'success' && (
                    <span style={{ color: '#34d399', fontWeight: '600' }}>
                      GPS attached ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
                    </span>
                  )}
                  {locationStatus === 'denied' && (
                    <span style={{ color: '#f87171' }}>Location permission denied.</span>
                  )}
                  {locationStatus === 'error' && (
                    <span style={{ color: '#f87171' }}>Unable to retrieve GPS.</span>
                  )}
                </div>
              </div>

              {locationStatus !== 'success' && (
                <button
                  onClick={handleRequestLocation}
                  disabled={locationStatus === 'fetching'}
                  style={{
                    background: 'var(--accent-purple)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}
                >
                  {locationStatus === 'fetching' ? 'Locating...' : 'Attach GPS'}
                </button>
              )}
            </div>

            {/* Optional note input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                Additional Emergency Context (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. In an auto near Metro Pillar 140, driver taking detour"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            {/* Generated Message Preview */}
            <div style={{
              background: '#090d16',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
                Prepared Message Preview:
              </div>
              <pre style={{
                fontFamily: 'inherit',
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                {emergencyMessage}
              </pre>

              <button
                onClick={handleCopyMessage}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: copied ? 'var(--status-success)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Trusted Contacts Quick Send Actions */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Send to Trusted Contacts ({contacts.length}):
              </div>

              {contacts.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '8px 0' }}>
                  No contacts configured yet. Go to Helplines & Contacts page to add them.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-secondary)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: 'white' }}>{contact.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {contact.phone} {contact.relationship ? `(${contact.relationship})` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={storage.getWhatsAppUrl(contact.phone, emergencyMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#25D366',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Send size={12} />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={storage.getSmsUrl(contact.phone, emergencyMessage)}
                          style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                          }}
                        >
                          SMS
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Explicit Privacy / Security Disclaimer */}
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              lineHeight: 1.4,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '10px'
            }}>
              🔒 <strong>Browser Security Notice:</strong> Web browsers do not send background SMS or share locations automatically without explicit user action. Clicking WhatsApp or SMS opens your native messaging application for you to review and tap send.
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

