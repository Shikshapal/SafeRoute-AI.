import React from 'react';
import { 
  Navigation, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  ArrowRight,
  Eye,
  Lock,
  Sparkles
} from 'lucide-react';

export default function Home({ setActivePage, onTriggerSos }) {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-tagline-badge">
          <Sparkles size={14} color="#c084fc" />
          <span>Hackathon Edition • Women Safety Innovation</span>
        </div>

        <h1 className="hero-title">
          SafeRoute <span className="text-gradient-purple-pink">AI</span>
          <br />
          <span style={{ fontSize: '0.65em', fontWeight: '700', color: 'var(--text-main)' }}>
            “Your Safety, Your Journey.”
          </span>
        </h1>

        <p className="hero-subtitle">
          An ethical, next-generation personal safety companion empowering women with OpenStreetMap route planning, instant verified emergency helplines, transparent situational guidance, and a one-click SOS workflow.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="hero-cta-group">
          <button 
            className="btn-primary"
            onClick={() => setActivePage('planner')}
          >
            <Navigation size={18} />
            <span>Plan a Safe Route</span>
          </button>

          <button 
            className="btn-danger pulse-sos"
            onClick={onTriggerSos}
          >
            <AlertTriangle size={18} />
            <span>SOS Emergency (112)</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={() => setActivePage('ai-chat')}
          >
            <MessageSquare size={18} color="#c084fc" />
            <span>AI Safety Assistant</span>
          </button>
        </div>

        {/* Quick Indian Emergency Helplines Strip */}
        <div className="helpline-quick-bar">
          <a href="tel:112" className="helpline-pill" title="Unified Emergency">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>National Emergency</div>
              <div className="helpline-number">112</div>
            </div>
            <PhoneCall size={18} color="#ef4444" />
          </a>

          <a href="tel:1091" className="helpline-pill" title="Women Police Helpline">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Women Helpline</div>
              <div className="helpline-number" style={{ color: '#c084fc' }}>1091</div>
            </div>
            <PhoneCall size={18} color="#c084fc" />
          </a>

          <a href="tel:181" className="helpline-pill" title="Women in Distress">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distress / Domestic</div>
              <div className="helpline-number" style={{ color: '#38bdf8' }}>181</div>
            </div>
            <PhoneCall size={18} color="#38bdf8" />
          </a>

          <a href="tel:1930" className="helpline-pill" title="National Cyber Crime">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cyber Crime Cell</div>
              <div className="helpline-number" style={{ color: '#34d399' }}>1930</div>
            </div>
            <PhoneCall size={18} color="#34d399" />
          </a>
        </div>
      </section>

      {/* Ethical Transparency Statement Banner */}
      <section style={{
        background: 'rgba(147, 51, 234, 0.08)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(147, 51, 234, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={26} color="#c084fc" />
        </div>
        <div>
          <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'white', marginBottom: '4px' }}>
            Ethical & Transparent Safety Guarantee
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            SafeRoute AI upholds strict algorithmic integrity. We <strong>never invent fake crime statistics</strong>, fabricate danger heatmaps, or claim silent background SMS dispatch. When verified municipal crime data is unavailable, we transparently state <em>“Safety data unavailable”</em> and provide actionable situational precautions instead.
          </p>
        </div>
      </section>

      {/* Main Core Features 2x2 Grid */}
      <div className="dashboard-grid">
        {/* Card 1: Safe Route Planner */}
        <div 
          className="glass-card feature-card"
          onClick={() => setActivePage('planner')}
        >
          <div>
            <div className="feature-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <Navigation size={26} />
            </div>
            <div className="badge badge-purple" style={{ marginBottom: '10px' }}>OpenStreetMap & OSRM</div>
            <h3 className="feature-title">Safe Route Planner</h3>
            <p className="feature-desc">
              Calculate driving or walking corridors with distance, travel time, and route alternatives. Access transparent safety checklists and nearby civic emergency infrastructure.
            </p>
          </div>
          <div className="feature-action-link">
            <span>Explore Routes</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 2: SOS Emergency Assistant */}
        <div 
          className="glass-card feature-card"
          style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
          onClick={() => setActivePage('sos')}
        >
          <div>
            <div className="feature-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <AlertTriangle size={26} />
            </div>
            <div className="badge badge-danger" style={{ marginBottom: '10px' }}>Rapid Assistance</div>
            <h3 className="feature-title">SOS Emergency Center</h3>
            <p className="feature-desc">
              Two-step verified SOS protocol. Instantly dial 112 or generate a pre-formatted emergency message with GPS coordinates to share via WhatsApp or SMS.
            </p>
          </div>
          <div className="feature-action-link" style={{ color: '#f87171' }}>
            <span>Activate SOS Workflow</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 3: AI Safety Assistant */}
        <div 
          className="glass-card feature-card"
          onClick={() => setActivePage('ai-chat')}
        >
          <div>
            <div className="feature-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <MessageSquare size={26} />
            </div>
            <div className="badge badge-purple" style={{ marginBottom: '10px' }}>Offline Ready • Free</div>
            <h3 className="feature-title">AI Safety Companion</h3>
            <p className="feature-desc">
              Ask contextual women's safety questions: late-night cab precautions, what to do if followed, transit tips, and key Indian legal rights like Zero FIR.
            </p>
          </div>
          <div className="feature-action-link">
            <span>Ask Safety AI</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 4: Helplines & Contacts */}
        <div 
          className="glass-card feature-card"
          onClick={() => setActivePage('contacts')}
        >
          <div>
            <div className="feature-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
              <Users size={26} />
            </div>
            <div className="badge badge-pink" style={{ marginBottom: '10px' }}>Private & Local</div>
            <h3 className="feature-title">Emergency Contacts</h3>
            <p className="feature-desc">
              Configure personal trusted contacts with 10-digit Indian mobile validation. All contact details stay strictly inside your browser's private localStorage.
            </p>
          </div>
          <div className="feature-action-link" style={{ color: '#f472b6' }}>
            <span>Manage Contacts</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Safety Tips Quick Preview Row */}
      <section style={{
        marginTop: '10px',
        marginBottom: '40px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
              Essential Situational Safety Guidelines
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Curated by women's safety advocates and legal advisors.
            </p>
          </div>
          <button 
            className="btn-secondary"
            onClick={() => setActivePage('tips')}
          >
            <BookOpen size={16} />
            <span>View All Guides & Legal Rights</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-accent)' }}>
            <div style={{ fontWeight: '700', color: '#c084fc', marginBottom: '6px', fontSize: '0.95rem' }}>
              1. The Right to Zero FIR
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Under Indian law, a woman can lodge an FIR at any police station regardless of where the incident took place. Police cannot refuse citing jurisdiction.
            </p>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-pink)' }}>
            <div style={{ fontWeight: '700', color: '#f472b6', marginBottom: '6px', fontSize: '0.95rem' }}>
              2. 4-Point Cab Inspection
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Verify registration plate, confirm child locks are disabled before boarding, ask 'Who are you picking up?', and share live GPS tracking.
            </p>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontWeight: '700', color: '#60a5fa', marginBottom: '6px', fontSize: '0.95rem' }}>
              3. If Suspecting a Stalker
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Never head into an empty residential alley. Cross the street immediately and walk into a 24/7 chemist, bank ATM with a guard, or busy restaurant.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

