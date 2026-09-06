import React, { useState } from 'react';
import { X, ArrowLeftRight, CheckCircle2, Send, Tag, Building2, User } from 'lucide-react';

export default function SkillDetailModal({ skill, onClose }) {
  const [proposalSent, setProposalSent] = useState(false);
  const [offerText, setOfferText] = useState('');

  if (!skill) return null;

  const handleSendProposal = (e) => {
    e.preventDefault();
    setProposalSent(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                {skill.category}
              </span>
              <span className="level-badge level-intermediate">
                {skill.level}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--slate-900)' }}>
              {skill.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.4rem', color: 'var(--slate-400)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Student Profile Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--slate-200)'
          }}>
            <img
              src={skill.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={skill.user?.name}
              style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                {skill.user?.name || 'Peer Collaborator'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                <Building2 size={14} />
                <span>{skill.user?.university || 'University Student'}</span>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              What You Will Learn
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {skill.description}
            </p>
          </div>

          {/* Swap Preference Highlight Box */}
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#eef2ff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #c7d2fe'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '0.35rem'
            }}>
              <ArrowLeftRight size={16} />
              <span>What {skill.user?.name ? skill.user.name.split(' ')[0] : 'The Student'} Wants to Learn:</span>
            </div>
            <p style={{ fontSize: '0.925rem', color: 'var(--slate-800)', fontWeight: 500 }}>
              {skill.swapPreferences || 'Open to discussing suitable peer skill exchanges!'}
            </p>
          </div>

          {/* Tags */}
          {skill.tags && skill.tags.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-400)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Tag size={13} />
                <span>Related Topics</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skill.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'var(--slate-100)',
                      color: 'var(--slate-700)',
                      fontSize: '0.8rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Swap Request Section */}
          <div style={{
            borderTop: '1px solid var(--slate-200)',
            paddingTop: '1.25rem'
          }}>
            {proposalSent ? (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#065f46'
              }}>
                <CheckCircle2 size={24} style={{ color: '#10b981', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Swap Proposal Sent!</div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {skill.user?.name || 'The student'} will receive your proposal notification.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendProposal}>
                <div className="form-group">
                  <label className="form-label">Propose a Skill Exchange</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder={`Hi ${skill.user?.name ? skill.user.name.split(' ')[0] : 'there'}! I can help teach you React/Design in exchange for learning this...`}
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                    <Send size={16} />
                    <span>Send Proposal</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
