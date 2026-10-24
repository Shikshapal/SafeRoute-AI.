import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  Send, 
  Copy, 
  Check, 
  ShieldAlert, 
  Share2, 
  Lock, 
  ArrowRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { storage } from '../services/storage';

export default function SosEmergency({ setActivePage }) {
  const [contacts, setContacts] = useState([]);
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | fetching | success | denied | error
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmedEmergency, setConfirmedEmergency] = useState(false);

  useEffect(() => {
    setContacts(storage.getContacts());
  }, []);

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setLocationStatus('success');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus('denied');
        } else {
          setLocationStatus('error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const emergencyMessage = storage.generateSosMessage(coords, customNote);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emergencyMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Emergency message copied to clipboard!');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '880px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className="badge badge-danger" style={{ marginBottom: '10px' }}>
          Immediate Response Station
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f87171' }}>
          SOS Emergency Assistance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Activate instant verified emergency dialers or generate a high-priority location dispatch message for your personal contacts.
        </p>
      </div>

      {/* Confirmation Step / Guardrail */}
      {!confirmedEmergency ? (
        <div className="glass-card" style={{
          borderColor: 'rgba(239, 68, 68, 0.4)',
          padding: '36px 24px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <ShieldAlert size={36} color="#ef4444" />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', marginBottom: '10px' }}>
            Emergency Protocol Activation
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Are you in an urgent or distress situation? Tapping below unlocks direct one-click dials to India's Emergency (112), Women Helpline (1091), and generates pre-filled location links.
          </p>

          <button
            className="btn-danger pulse-sos"
            style={{ fontSize: '1.05rem', padding: '16px 36px' }}
            onClick={() => {
              setConfirmedEmergency(true);
              handleFetchLocation(); // Attempt location fetch with consent
            }}
          >
            <AlertTriangle size={20} />
            <span>CONFIRM EMERGENCY & UNLOCK ACTIONS</span>
          </button>
        </div>
      ) : (
        /* Action Interface once confirmed */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* STEP 1: DIRECT 1-CLICK CALLS */}
          <div className="glass-card" style={{ padding: '24px', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PhoneCall size={22} color="#ef4444" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
                  1. Instant Emergency Call Dials
                </h2>
              </div>
              <span className="badge badge-danger">Live Dialer</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {/* Call 112 */}
              <a
                href="tel:112"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-danger)'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800' }}>CALL 112</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Unified National Emergency (India)</div>
                </div>
                <div style={{
                  background: 'white',
                  color: '#b91c1c',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '800',
                  fontSize: '0.85rem'
                }}>
                  TAP TO DIAL
                </div>
              </a>

              {/* Call 1091 */}
              <a
                href="tel:1091"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-purple)'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800' }}>CALL 1091</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>24/7 Women Police Helpline</div>
                </div>
                <div style={{
                  background: 'white',
                  color: '#7e22ce',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '800',
                  fontSize: '0.85rem'
                }}>
                  TAP TO DIAL
                </div>
              </a>
            </div>
          </div>

          {/* STEP 2: GPS LOCATION DISPATCH TO TRUSTED CONTACTS */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={22} color="#10b981" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
                  2. Share GPS Location with Trusted Contacts
                </h2>
              </div>
              <span className="badge badge-purple">Coordinates Generator</span>
            </div>

            {/* GPS permission status box */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color={coords ? '#10b981' : '#f59e0b'} />
                  <span>
                    {locationStatus === 'success' && 'GPS Coordinates Attached Successfully'}
                    {locationStatus === 'fetching' && 'Acquiring high-accuracy GPS coordinates...'}
                    {locationStatus === 'denied' && 'Location Permission Denied in Browser'}
                    {locationStatus === 'idle' && 'No location attached yet'}
                    {locationStatus === 'error' && 'Failed to determine GPS fix'}
                  </span>
                </div>
                {coords && (
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    Latitude: {coords.latitude.toFixed(6)} • Longitude: {coords.longitude.toFixed(6)}
                    {coords.accuracy && ` (Accurate within ~${Math.round(coords.accuracy)}m)`}
                  </div>
                )}
                {locationStatus === 'denied' && (
                  <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>
                    Please click 'Allow' in your browser location prompt, or copy the message manually.
                  </div>
                )}
              </div>

              <button
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                onClick={handleFetchLocation}
                disabled={locationStatus === 'fetching'}
              >
                {locationStatus === 'fetching' ? 'Locating...' : 'Refresh GPS Fix'}
              </button>
            </div>

            {/* Optional extra detail input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Urgent Situation Note (Optional):
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. In white cab DL-01-XXXX, driver turned off highway near Outer Ring Road"
                style={{ width: '100%' }}
              />
            </div>

            {/* Prepared Message Box */}
            <div style={{
              background: '#090d16',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              position: 'relative',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: '700', marginBottom: '8px' }}>
                Pre-formatted Emergency Dispatch Text:
              </div>
              <pre style={{
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                color: 'white',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.5'
              }}>
                {emergencyMessage}
              </pre>

              <button
                onClick={handleCopy}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: copied ? 'var(--status-success)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            {/* Contacts Direct Action List */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'white' }}>
                  Dispatch to Trusted Contacts ({contacts.length}):
                </span>
                <button
                  onClick={() => setActivePage('contacts')}
                  style={{ background: 'none', color: '#c084fc', fontSize: '0.8rem', fontWeight: '700' }}
                >
                  Edit Contacts List →
                </button>
              </div>

              {contacts.length === 0 ? (
                <div style={{
                  background: 'var(--bg-secondary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  You have not configured any personal emergency contacts yet.
                  <br />
                  <button
                    onClick={() => setActivePage('contacts')}
                    className="btn-primary"
                    style={{ marginTop: '12px', padding: '6px 16px', fontSize: '0.8rem' }}
                  >
                    Add Trusted Contacts
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {contacts.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: 'white' }}>{c.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Phone: {c.phone} {c.relationship ? `• ${c.relationship}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a
                          href={storage.getWhatsAppUrl(c.phone, emergencyMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#25D366',
                            color: 'white',
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Send size={14} />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={storage.getSmsUrl(c.phone, emergencyMessage)}
                          style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-accent)',
                            color: 'white',
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: '700',
                            fontSize: '0.8rem'
                          }}
                        >
                          Send SMS
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Regulatory and Security Transparency Notice */}
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-dim)',
              lineHeight: 1.5
            }}>
              ⚖️ <strong>Web Platform Security Guarantee:</strong> In strict compliance with W3C browser security specifications, websites are barred from secretly transmitting SMS or placing background phone calls without user confirmation. SafeRoute AI formats the payload and routes you directly into your trusted messaging app or dialer with your explicit consent.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

