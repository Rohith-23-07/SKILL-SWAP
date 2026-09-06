import React from 'react';
import { ArrowLeftRight, User, Trash2 } from 'lucide-react';

export default function SkillCard({ skill, onSelect, onDelete }) {
  const getCategoryClass = (category) => {
    switch (category) {
      case 'Programming': return 'badge-programming';
      case 'AI & Data Science': return 'badge-ai';
      case 'Design': return 'badge-design';
      case 'DevOps & Cloud': return 'badge-cloud';
      case 'Languages': return 'badge-languages';
      case 'Academic': return 'badge-academic';
      default: return 'badge-default';
    }
  };

  const getLevelClass = (level) => {
    switch (level) {
      case 'Beginner': return 'level-beginner';
      case 'Intermediate': return 'level-intermediate';
      case 'Advanced': return 'level-advanced';
      default: return 'level-intermediate';
    }
  };

  const skillId = skill._id || skill.id;

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header with Category & Level */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          gap: '0.5rem'
        }}>
          <span className={`badge ${getCategoryClass(skill.category)}`}>
            {skill.category}
          </span>
          <span className={`level-badge ${getLevelClass(skill.level)}`}>
            {skill.level}
          </span>
        </div>

        {/* Skill Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          marginBottom: '0.65rem',
          lineHeight: 1.35,
          color: 'var(--slate-900)'
        }}>
          {skill.title}
        </h3>

        {/* Description Excerpt */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--slate-600)',
          lineHeight: 1.5,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {skill.description}
        </p>

        {/* Swap Preference Highlight */}
        <div style={{
          backgroundColor: 'var(--slate-50)',
          border: '1px solid var(--slate-200)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginBottom: '0.25rem'
          }}>
            <ArrowLeftRight size={13} />
            <span>Seeking in Exchange</span>
          </div>
          <div style={{
            fontSize: '0.825rem',
            color: 'var(--slate-700)',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {skill.swapPreferences || 'Open to relevant skill swap proposals'}
          </div>
        </div>

        {/* Author / Student Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--slate-100)'
        }}>
          <img
            src={skill.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={skill.user?.name || 'Student'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--slate-200)'
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--slate-800)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {skill.user?.name || 'Anonymous Student'}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--slate-400)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {skill.user?.university || 'University Member'}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div style={{
        backgroundColor: 'var(--slate-50)',
        borderTop: '1px solid var(--slate-200)',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => onSelect(skill)}
          className="btn btn-primary btn-sm"
          style={{ width: '100%', gap: '0.4rem' }}
        >
          <ArrowLeftRight size={15} />
          <span>View Details & Swap</span>
        </button>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete listing "${skill.title}"?`)) {
                onDelete(skillId);
              }
            }}
            className="btn btn-ghost btn-sm"
            title="Delete Skill Listing"
            style={{ color: '#ef4444', padding: '0.4rem' }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
