import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  Info, 
  CheckCircle,
  PhoneCall,
  Navigation
} from 'lucide-react';
import { api } from '../services/api';

const STARTER_PROMPTS = [
  'What should I do if my cab driver takes a wrong route?',
  'Someone is following me on foot right now. What should I do?',
  'What is Zero FIR and can police refuse my complaint?',
  'What are key safety practices for late night metro commute?',
  'What is the law regarding arresting women after sunset in India?',
  'How do I report online cyber harassment or non-consensual photo threats?'
];

export default function AiSafetyChat({ setActivePage, onTriggerSos }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: (
        "Hello! I am your **SafeRoute AI Safety Companion**.\n\n" +
        "I provide tactical advice on:\n" +
        "• **Cab and rideshare precautions & wrong route response**\n" +
        "• **Immediate tactical steps if followed or feeling unsafe**\n" +
        "• **Solo transit & night commute practices**\n" +
        "• **Women's legal rights in India (Zero FIR, Section 46 CrPC)**\n" +
        "• **Official emergency helplines (112, 1091, 181, 1930)**\n\n" +
        "*How can I assist your journey today?*"
      ),
      suggestedActions: ['Plan Safe Route', 'Emergency Helplines', 'SOS 112']
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText = null) => {
    const text = (messageText || input).trim();
    if (!text || loading) return;

    // Add user message to thread
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendAiMessage(text);
      if (response && response.success && response.data) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: response.data.reply,
            mode: response.data.mode,
            urgent: response.data.urgent,
            suggestedActions: response.data.suggested_actions || []
          }
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: '⚠️ I encountered an issue connecting to the safety knowledge server. If you are in an emergency, please dial **112** immediately.'
          }
        ]);
      }
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ Connection timeout. For any urgent threat, immediately dial **112** or activate the SOS button above.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.includes('112') || action.toLowerCase().includes('sos')) {
      onTriggerSos();
    } else if (action.toLowerCase().includes('route')) {
      setActivePage('planner');
    } else if (action.toLowerCase().includes('helpline') || action.toLowerCase().includes('contact')) {
      setActivePage('contacts');
    } else if (action.toLowerCase().includes('tips')) {
      setActivePage('tips');
    } else {
      handleSend(action);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '30px' }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="badge badge-purple" style={{ marginBottom: '8px' }}>
          Intelligent Safety Assistant
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>
          AI Safety Companion
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
          Tactical advice, transit checklists, and Indian legal rights knowledge. Operates 100% free and offline without requiring a paid API key.
        </p>
      </div>

      {/* Honest Boundary & Disclaimer Banner */}
      <div style={{
        maxWidth: '860px',
        margin: '0 auto 16px auto',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
        color: '#fcd34d'
      }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Transparent AI Scope:</strong> This assistant provides verified safety tips and legal rights guidance. It does <em>not</em> possess real-time police telemetry and <em>cannot</em> autonomously call emergency services for you. In danger, call <strong>112</strong>.
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="glass-card chat-window">
        {/* Chat Header */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>
                SafeRoute Safety Engine
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                <span>Offline Demo Ready • No API Key Needed</span>
              </div>
            </div>
          </div>

          <button
            className="btn-danger"
            onClick={onTriggerSos}
            style={{ padding: '6px 14px', fontSize: '0.75rem' }}
          >
            <PhoneCall size={12} />
            <span>SOS 112</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={`message-bubble ${m.role === 'user' ? 'message-user' : 'message-assistant'}`}>
                {/* Urgent indicator if triggered */}
                {m.urgent && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#f87171',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>
                    <ShieldAlert size={16} />
                    <span>High Urgency Detected</span>
                  </div>
                )}

                <div style={{ whiteSpace: 'pre-line' }}>
                  {m.content}
                </div>
              </div>

              {/* Action chips suggested by the assistant */}
              {m.suggestedActions && m.suggestedActions.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', marginLeft: m.role === 'assistant' ? '4px' : '0' }}>
                  {m.suggestedActions.map((action, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => handleActionClick(action)}
                      style={{
                        background: 'rgba(147, 51, 234, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        color: '#d8b4fe',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      {action} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="message-bubble message-assistant" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analyzing safety knowledge base...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Chips */}
        <div className="chips-row">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', alignSelf: 'center', flexShrink: 0 }}>
            Try asking:
          </span>
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              className="prompt-chip"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Field */}
        <form
          className="chat-input-area"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Type your safety question (e.g. cab precautions, what is Zero FIR, being followed)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0 20px' }}
            disabled={loading || !input.trim()}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

