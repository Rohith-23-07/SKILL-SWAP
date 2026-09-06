import React, { useState } from 'react';
import { ArrowLeftRight, PlusCircle, Search, User, Menu, X, Database, LogIn, LogOut, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddSkill, onOpenAuth, user, onLogout, dbStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--slate-200)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <ArrowLeftRight size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span>Skill</span>
              <span style={{ color: 'var(--primary)' }}>Swap</span>
            </div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--slate-400)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Student Exchange
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem',
        }} className="desktop-nav">
          <button
            onClick={() => handleNavClick('home')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.925rem',
              color: activeTab === 'home' ? 'var(--primary)' : 'var(--slate-600)',
              backgroundColor: activeTab === 'home' ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('browse')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.925rem',
              color: activeTab === 'browse' ? 'var(--primary)' : 'var(--slate-600)',
              backgroundColor: activeTab === 'browse' ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Browse Skills
          </button>
          {user && (
            <>
              <button
                onClick={() => handleNavClick('my-skills')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: activeTab === 'my-skills' ? 'var(--primary)' : 'var(--slate-600)',
                  backgroundColor: activeTab === 'my-skills' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                My Skills
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: activeTab === 'profile' ? 'var(--primary)' : 'var(--slate-600)',
                  backgroundColor: activeTab === 'profile' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                Profile
              </button>
            </>
          )}
          <button
            onClick={onOpenAddSkill}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginLeft: '0.5rem',
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              backgroundColor: '#ffffff'
            }}
          >
            <PlusCircle size={16} />
            <span>Add Skill</span>
          </button>
        </nav>

        {/* Right Actions / Auth */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.85rem'
        }} className="desktop-nav">
          {/* Cloud Database Status Pill */}
          <div 
            title={dbStatus?.status || 'Database Status'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: dbStatus?.cloudConnected ? '#ecfdf5' : '#f1f5f9',
              border: `1px solid ${dbStatus?.cloudConnected ? '#a7f3d0' : '#e2e8f0'}`,
              fontSize: '0.75rem',
              color: dbStatus?.cloudConnected ? '#059669' : '#64748b',
              fontWeight: 600
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: dbStatus?.cloudConnected ? '#10b981' : '#94a3b8'
            }} />
            <Database size={13} />
            <span>{dbStatus?.cloudConnected ? 'MongoDB Cloud' : 'Demo DB'}</span>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => handleNavClick('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: activeTab === 'profile' ? 'var(--primary-light)' : 'var(--slate-100)',
                  border: `1px solid ${activeTab === 'profile' ? 'var(--primary)' : 'var(--slate-200)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="View Profile"
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt={user.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <button 
                onClick={onLogout}
                className="btn btn-ghost btn-sm" 
                title="Log Out"
                style={{ padding: '0.45rem', color: 'var(--slate-500)' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <LogIn size={16} />
              <span>Login / Register</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            padding: '0.5rem',
            color: 'var(--slate-700)'
          }}
          className="mobile-nav-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--slate-200)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <button
            onClick={() => handleNavClick('home')}
            style={{
              textAlign: 'left',
              padding: '0.65rem 0.5rem',
              fontWeight: 600,
              color: activeTab === 'home' ? 'var(--primary)' : 'var(--slate-700)'
            }}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('browse')}
            style={{
              textAlign: 'left',
              padding: '0.65rem 0.5rem',
              fontWeight: 600,
              color: activeTab === 'browse' ? 'var(--primary)' : 'var(--slate-700)'
            }}
          >
            Browse Skills
          </button>
          {user && (
            <>
              <button
                onClick={() => handleNavClick('my-skills')}
                style={{
                  textAlign: 'left',
                  padding: '0.65rem 0.5rem',
                  fontWeight: 600,
                  color: activeTab === 'my-skills' ? 'var(--primary)' : 'var(--slate-700)'
                }}
              >
                My Skills
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                style={{
                  textAlign: 'left',
                  padding: '0.65rem 0.5rem',
                  fontWeight: 600,
                  color: activeTab === 'profile' ? 'var(--primary)' : 'var(--slate-700)'
                }}
              >
                Profile
              </button>
            </>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAddSkill();
            }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start' }}
          >
            <PlusCircle size={18} />
            <span>Add Skill</span>
          </button>

          <hr style={{ border: 'none', borderTop: '1px solid var(--slate-200)', margin: '0.5rem 0' }} />

          {user ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div 
                onClick={() => handleNavClick('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt={user.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{user.university}</div>
                </div>
              </div>
              <button onClick={onLogout} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="btn btn-primary"
            >
              <LogIn size={18} />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      )}

      {/* Simple style tag for responsive media queries */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
