import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AddSkillModal({ isOpen, onClose, onSkillAdded, currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Programming',
    level: 'Intermediate',
    description: '',
    swapPreferences: '',
    tags: '',
    userName: currentUser?.name || '',
    userUniversity: currentUser?.university || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in both the title and description.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        level: formData.level,
        description: formData.description.trim(),
        swapPreferences: formData.swapPreferences.trim() || 'Open to relevant skill swaps',
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        userName: formData.userName.trim() || (currentUser?.name || 'Student Collaborator'),
        userUniversity: formData.userUniversity.trim() || (currentUser?.university || 'University Student')
      };

      const res = await api.createSkill(payload);
      if (res.success && res.data) {
        onSkillAdded(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to publish skill listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              <PlusCircle size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>
              Offer a New Skill
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

          {/* Skill Title */}
          <div className="form-group">
            <label className="form-label">Skill Title *</label>
            <input
              type="text"
              name="title"
              required
              className="form-input"
              placeholder="e.g. Modern React & Next.js 14 Development"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Category & Level Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Programming">Programming</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Design">Design</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Languages">Languages</option>
                <option value="Academic">Academic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">Proficiency Level</label>
              <select
                name="level"
                className="form-select"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">What You Can Teach *</label>
            <textarea
              name="description"
              rows={3}
              required
              className="form-textarea"
              placeholder="Describe what you know and how you can guide another student (e.g., project building, homework help, conceptual fundamentals)..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Wanted Skills */}
          <div className="form-group">
            <label className="form-label">What You Want in Return *</label>
            <input
              type="text"
              name="swapPreferences"
              required
              className="form-input"
              placeholder="e.g. Want to learn Python for Machine Learning or UI/UX Figma"
              value={formData.swapPreferences}
              onChange={handleChange}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Keywords / Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-input"
              placeholder="e.g. React, JavaScript, Frontend, WebDev"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {/* Student Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label">Your Name</label>
              <input
                type="text"
                name="userName"
                className="form-input"
                placeholder={currentUser?.name || "e.g. Rohan Patel"}
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">University / College</label>
              <input
                type="text"
                name="userUniversity"
                className="form-input"
                placeholder={currentUser?.university || "e.g. State Tech University"}
                value={formData.userUniversity}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
              <span>{loading ? 'Publishing...' : 'Publish Skill Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
