import React, { useState, useEffect } from 'react';
import { X, UserCheck, Sparkles, Building2, BookOpen, GraduationCap } from 'lucide-react';
import { api } from '../services/api';

export default function EditProfileModal({ isOpen, onClose, currentUser, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    bio: '',
    skillsOffered: '',
    skillsWanted: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        university: currentUser.university || '',
        bio: currentUser.bio || '',
        skillsOffered: Array.isArray(currentUser.skillsOffered)
          ? currentUser.skillsOffered.join(', ')
          : (currentUser.skillsOffered || ''),
        skillsWanted: Array.isArray(currentUser.skillsWanted)
          ? currentUser.skillsWanted.join(', ')
          : (currentUser.skillsWanted || '')
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        university: formData.university.trim(),
        bio: formData.bio.trim(),
        skillsOffered: formData.skillsOffered
          ? formData.skillsOffered.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        skillsWanted: formData.skillsWanted
          ? formData.skillsWanted.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };

      const res = await api.updateProfile(payload);
      if (res.success && res.user) {
        onProfileUpdated(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCheck size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>
              Edit Student Profile
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* Name & University */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">University / College</label>
              <input
                type="text"
                name="university"
                className="form-input"
                value={formData.university}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">About You / Student Bio</label>
            <textarea
              name="bio"
              rows={3}
              className="form-textarea"
              placeholder="Tell other students what you study, your academic interests, or projects you are working on..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          {/* Skills Offered */}
          <div className="form-group">
            <label className="form-label">Skills You Offer (comma-separated)</label>
            <input
              type="text"
              name="skillsOffered"
              className="form-input"
              placeholder="e.g. React, Node.js, Python, Figma"
              value={formData.skillsOffered}
              onChange={handleChange}
            />
          </div>

          {/* Skills Wanted */}
          <div className="form-group">
            <label className="form-label">Skills You Want to Learn (comma-separated)</label>
            <input
              type="text"
              name="skillsWanted"
              className="form-input"
              placeholder="e.g. Machine Learning, Cloud DevOps, Docker"
              value={formData.skillsWanted}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ gap: '0.4rem', opacity: loading ? 0.7 : 1 }}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
