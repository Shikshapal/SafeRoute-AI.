import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  Scale, 
  Shield, 
  Compass, 
  Car, 
  Bus, 
  PhoneCall, 
  Lock,
  Tag
} from 'lucide-react';
import { api } from '../services/api';

export default function SafetyTips({ setActivePage, onTriggerSos }) {
  const [tips, setTips] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTipsAndCategories();
  }, []);

  const loadTipsAndCategories = async () => {
    setLoading(true);
    try {
      const [tipsRes, catRes] = await Promise.all([
        api.getSafetyTips(),
        api.getSafetyCategories()
      ]);

      if (tipsRes && tipsRes.success) {
        setTips(tipsRes.data || []);
      }
      if (catRes && catRes.success) {
        setCategories(['All', ...(catRes.data || [])]);
      }
    } catch (e) {
      console.warn('Error loading safety tips:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTips = tips.filter((tip) => {
    const matchesCat = selectedCategory === 'All' || tip.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      tip.title.toLowerCase().includes(query) ||
      tip.summary.toLowerCase().includes(query) ||
      tip.content.toLowerCase().includes(query) ||
      (tip.tags && tip.tags.some(t => t.toLowerCase().includes(query)));
    return matchesCat && matchesQuery;
  });

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'solo travel': return Compass;
      case 'public transit': return Bus;
      case 'cab & rideshare': return Car;
      case 'emergency response': return PhoneCall;
      case "women's legal rights (india)": return Scale;
      case 'cyber safety': return Lock;
      default: return Shield;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1100px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div className="badge badge-purple" style={{ marginBottom: '8px' }}>
          Knowledge & Legal Empowerments
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>
          Practical Safety & Legal Rights Guide
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Actionable protocols for solo transit, cab inspections, de-escalation, and fundamental legal rights under Indian jurisprudence.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '28px'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search guidelines (e.g. Zero FIR, cab check, followed, metro)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '42px' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: '600',
                background: selectedCategory === cat ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))' : 'var(--bg-secondary)',
                border: `1px solid ${selectedCategory === cat ? 'var(--accent-pink)' : 'var(--border-subtle)'}`,
                color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading safety guidance repository...
        </div>
      ) : filteredTips.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-muted)'
        }}>
          No safety guides found matching "{searchQuery}". Try a different keyword or category.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredTips.map((tip) => {
            const Icon = getCategoryIcon(tip.category);
            const isLegal = tip.category.toLowerCase().includes('legal');
            return (
              <div
                key={tip.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: isLegal ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        background: isLegal ? 'rgba(168, 85, 247, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isLegal ? '#c084fc' : '#f472b6'
                      }}>
                        <Icon size={18} />
                      </div>
                      <span className={isLegal ? 'badge badge-purple' : 'badge badge-pink'}>
                        {tip.category}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
                    {tip.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '12px', fontWeight: '500', lineHeight: '1.5' }}>
                    {tip.summary}
                  </p>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                    {tip.content}
                  </p>

                  {/* Checklist if present */}
                  {tip.actionable_checklist && tip.actionable_checklist.length > 0 && (
                    <div style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      marginBottom: '14px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Key Action Items:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {tip.actionable_checklist.map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                            <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {tip.tags && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    {tip.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '0.7rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--text-dim)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

