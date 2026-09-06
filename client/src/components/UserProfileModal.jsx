import React, { useState, useEffect } from 'react';
import { X, Building2, Calendar, BookOpen, ArrowLeftRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function UserProfileModal({ userId, onClose, onSelectSkill }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError('');
      api.getUserProfile(userId)
        .then((res) => {
          if (res.success) {
            setProfileData(res);
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to load student profile');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (!userId) return null;

  const user = profileData?.user;
  const skills = profileData?.skills || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)' }}>
            Student Profile
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--slate-400)' }}>
              Loading student profile...
            </div>
          ) : error ? (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          ) : user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Profile Card Top */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.25rem',
                backgroundColor: 'var(--slate-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--slate-200)'
              }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
                    {user.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                    <Building2 size={15} />
                    <span>{user.university || 'Student'}</span>
                  </div>
                  {user.createdAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-400)', fontSize: '0.775rem', marginTop: '0.25rem' }}>
                      <Calendar size={13} />
                      <span>Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.4rem' }}>
                    About
                  </h4>
                  <p style={{ color: 'var(--slate-700)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Skills Offered & Wanted */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Skills Offered
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {user.skillsOffered && user.skillsOffered.length > 0 ? (
                      user.skillsOffered.map((skill, i) => (
                        <span key={i} className="badge badge-academic">{skill}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.825rem', color: 'var(--slate-400)' }}>None listed</span>
                    )}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Skills Wanted
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {user.skillsWanted && user.skillsWanted.length > 0 ? (
                      user.skillsWanted.map((skill, i) => (
                        <span key={i} className="badge badge-programming">{skill}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.825rem', color: 'var(--slate-400)' }}>Open to all skills</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Skill Listings */}
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.75rem' }}>
                  Active Skill Listings ({skills.length})
                </h4>
                {skills.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate-400)', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                    This student hasn't posted any public skill listings yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {skills.map((skill) => (
                      <div
                        key={skill._id || skill.id}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--slate-200)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--slate-900)' }}>
                            {skill.title}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', display: 'flex', gap: '0.5rem' }}>
                            <span>{skill.category}</span>
                            <span>•</span>
                            <span>{skill.level}</span>
                          </div>
                        </div>
                        {onSelectSkill && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectSkill(skill);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ flexShrink: 0 }}
                          >
                            View
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
