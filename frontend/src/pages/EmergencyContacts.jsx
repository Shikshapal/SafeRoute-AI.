import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PhoneCall, 
  Plus, 
  Trash2, 
  Edit2, 
  ShieldCheck, 
  Lock, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';
import { storage } from '../services/storage';
import { api } from '../services/api';

export default function EmergencyContacts({ onTriggerSos }) {
  const [contacts, setContacts] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [loadingHelplines, setLoadingHelplines] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [editingId, setEditingId] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setContacts(storage.getContacts());
    fetchHelplines();
  }, []);

  const fetchHelplines = async () => {
    try {
      const res = await api.getHelplines();
      if (res && res.success) {
        setHelplines(res.data);
      }
    } catch (e) {
      console.warn('Failed to fetch helplines from backend:', e);
    } finally {
      setLoadingHelplines(false);
    }
  };

  const validatePhone = (phoneNumber) => {
    // 10-digit Indian mobile format starting with 6, 7, 8, or 9
    const clean = phoneNumber.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(clean);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setValidationError('Please enter contact full name or label.');
      return;
    }

    if (!validatePhone(phone)) {
      setValidationError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');

    if (editingId) {
      // Update existing
      storage.updateContact(editingId, {
        name: name.trim(),
        phone: cleanPhone,
        relationship
      });
      setSuccessMessage('Contact updated successfully.');
      setEditingId(null);
    } else {
      // Add new
      storage.addContact({
        name: name.trim(),
        phone: cleanPhone,
        relationship
      });
      setSuccessMessage('New trusted contact added.');
    }

    setContacts(storage.getContacts());
    setName('');
    setPhone('');
    setRelationship('Family');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditClick = (contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship || 'Family');
    setValidationError('');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this trusted emergency contact?')) {
      const updated = storage.deleteContact(id);
      setContacts(updated);
      if (editingId === id) {
        setEditingId(null);
        setName('');
        setPhone('');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div className="badge badge-pink" style={{ marginBottom: '8px' }}>
          National Helplines & Personal Network
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>
          Emergency Contacts & Helplines
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Direct toll-free access to national assistance lines and privately stored personal contacts.
        </p>
      </div>

      {/* Local Storage Privacy Disclaimer Notice */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.82rem',
        color: '#6ee7b7'
      }}>
        <Lock size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Privacy First:</strong> All personal contacts you enter below are stored <strong>strictly on your local device</strong> via browser <code>localStorage</code>. They are never uploaded or synced to external servers or advertisers.
        </div>
      </div>

      {/* SECTION 1: VERIFIED OFFICIAL INDIAN HELPLINES */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#c084fc" />
          <span>Official 24/7 National Emergency Helplines (India)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
          {(helplines.length > 0 ? helplines : [
            { name: 'National Emergency Number', number: '112', category: 'Police, Fire, Ambulance', description: 'Unified emergency response support system for police and medical emergencies across India.', badge: 'Primary 24/7' },
            { name: 'Women Helpline', number: '1091', category: 'Women Safety', description: 'Toll-free 24/7 dedicated women crisis response and police dispatch line.', badge: '24/7 Toll-Free' },
            { name: 'Women in Distress', number: '181', category: 'Crisis & Shelter', description: 'Immediate assistance for women facing abuse, distress, or requiring shelter.', badge: 'Support & Shelter' },
            { name: 'Cyber Crime Helpline', number: '1930', category: 'Online Harassment', description: 'Report online harassment, cyber stalking, and extortion directly to cyber police.', badge: 'Cyber Cell' },
            { name: 'NCW 24/7 Helpline', number: '7827170170', category: 'Legal & Crisis', description: 'National Commission for Women round-the-clock helpline and legal guidance.', badge: 'NCW Govt' },
            { name: 'Emergency Ambulance', number: '108', category: 'Medical Emergency', description: 'Disaster medical management and urgent ambulance dispatch.', badge: 'Medical' }
          ]).map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: item.number === '112' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-accent)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className={`badge ${item.number === '112' ? 'badge-danger' : 'badge-purple'}`}>
                    {item.badge || item.category}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: item.number === '112' ? '#f87171' : '#c084fc' }}>
                    {item.number}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                  {item.description}
                </p>
              </div>

              <a
                href={`tel:${item.number}`}
                style={{
                  background: item.number === '112' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'var(--bg-secondary)',
                  border: `1px solid ${item.number === '112' ? '#ef4444' : 'var(--border-accent)'}`,
                  color: 'white',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                <PhoneCall size={16} />
                <span>Call {item.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CONFIGURE TRUSTED PERSONAL CONTACTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Contact Input Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'white', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="#ec4899" />
            <span>{editingId ? 'Edit Emergency Contact' : 'Add Trusted Contact'}</span>
          </h2>

          {validationError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              marginBottom: '12px'
            }}>
              {validationError}
            </div>
          )}

          {successMessage && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              marginBottom: '12px'
            }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                Contact Name / Identifier
              </label>
              <input
                type="text"
                placeholder="e.g. Mom, Sister, Best Friend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                10-Digit Mobile Number (India)
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                maxLength={10}
                required
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Valid Indian numbers start with 6, 7, 8, or 9
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Parent / Guardian">Parent / Guardian</option>
                <option value="Sibling">Sibling</option>
                <option value="Partner / Spouse">Partner / Spouse</option>
                <option value="Friend">Friend</option>
                <option value="Colleague / Flatmate">Colleague / Flatmate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {editingId ? 'Update Contact' : 'Save Contact'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setPhone('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Contacts List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#c084fc" />
              <span>Configured Trusted Contacts ({contacts.length})</span>
            </h2>
          </div>

          {contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No contacts configured yet. Use the form to add family or close friends.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contacts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>{c.name}</span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                        {c.relationship}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#c084fc', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      +91 {c.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <a
                      href={`tel:${c.phone}`}
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Direct Phone Call"
                    >
                      <PhoneCall size={14} />
                      <span>Call</span>
                    </a>

                    <a
                      href={storage.getWhatsAppUrl(c.phone, "Hi, this is a test check-in message from SafeRoute AI.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'rgba(37, 211, 102, 0.15)',
                        color: '#25D366',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Send Test WhatsApp"
                    >
                      <Send size={14} />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleEditClick(c)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      title="Edit Contact"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      title="Delete Contact"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

