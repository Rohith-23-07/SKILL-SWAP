import React, { useState } from 'react';
import { X, LogIn, UserPlus, UserCheck, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: ''
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
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await api.login({
          email: formData.email,
          password: formData.password
        });
        if (res.success && res.user) {
          onAuthSuccess(res.user);
          onClose();
        }
      } else {
        const res = await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          university: formData.university
        });
        if (res.success && res.user) {
          onAuthSuccess(res.user);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.login({
        email: 'alex.chen@university.edu',
        password: 'password123'
      });
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {tab === 'login' ? 'Student Login' : 'Create Student Account'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--slate-200)',
          backgroundColor: 'var(--slate-50)'
        }}>
          <button
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderBottom: tab === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === 'login' ? 'var(--primary)' : 'var(--slate-500)',
              backgroundColor: tab === 'login' ? '#ffffff' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <LogIn size={16} />
            <span>Login</span>
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderBottom: tab === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === 'register' ? 'var(--primary)' : 'var(--slate-500)',
              backgroundColor: tab === 'register' ? '#ffffff' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <UserPlus size={16} />
            <span>Register</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {tab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-input"
                  placeholder="e.g. Alex Chen"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">University / College</label>
                <input
                  type="text"
                  name="university"
                  className="form-input"
                  placeholder="e.g. State Institute of Technology"
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Student Email *</label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              placeholder="e.g. student@university.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Log In to Skill Swap' : 'Create Account'}
          </button>

          {/* Quick Demo Login Option */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--slate-400)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--slate-200)' }} />
              <span>Or Quick Demo</span>
              <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--slate-200)' }} />
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-secondary"
              style={{ width: '100%', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <UserCheck size={16} />
              <span>Instant Demo Student Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
