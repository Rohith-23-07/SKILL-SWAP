import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, AlertCircle, CheckCircle2, ArrowLeftRight, Sparkles, Filter } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryFilter from './components/CategoryFilter';
import SkillCard from './components/SkillCard';
import SkillDetailModal from './components/SkillDetailModal';
import AddSkillModal from './components/AddSkillModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'browse'
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [toast, setToast] = useState(null);

  // Show temporary toast message
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch initial skills and system health
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.getSkills({
        q: searchQuery,
        category: selectedCategory
      });
      if (res.success && res.data) {
        setSkills(res.data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const res = await api.getHealth();
      if (res.database) {
        setDbStatus(res.database);
      }
    } catch (err) {
      console.warn('Backend server not reachable yet');
    }
  };

  useEffect(() => {
    checkHealth();
    fetchSkills();

    // Check for existing saved session
    const savedUser = localStorage.getItem('skillswap_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  // Re-fetch when category or search changes (debounced search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSkills();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('skillswap_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skillswap_user');
    showToast('You have been logged out.');
  };

  const handleSkillAdded = (newSkill) => {
    setSkills((prev) => [newSkill, ...prev]);
    showToast('Your skill has been successfully published!');
    setActiveTab('browse');
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => (s._id !== id && s.id !== id)));
      showToast('Skill listing deleted.');
    } catch (err) {
      showToast('Failed to delete skill.', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.925rem',
          fontWeight: 600,
          animation: 'modalFadeIn 0.25s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddSkill={() => setIsAddSkillOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onExplore={() => setActiveTab('browse')}
              onOfferSkill={() => setIsAddSkillOpen(true)}
              totalSkills={skills.length}
            />

            {/* Featured Skills Preview on Landing Page */}
            <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
              <div className="container">
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--primary)',
                      letterSpacing: '0.08em',
                      marginBottom: '0.35rem'
                    }}>
                      Recent Opportunities
                    </div>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      Featured Student Skills
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    <span>View All Listings ({skills.length})</span>
                    <ArrowLeftRight size={15} />
                  </button>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                    Loading available skills...
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {skills.slice(0, 3).map((skill) => (
                      <SkillCard
                        key={skill._id || skill.id}
                        skill={skill}
                        onSelect={setSelectedSkill}
                        onDelete={handleDeleteSkill}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'browse' && (
          <div style={{ padding: '2.5rem 0 4rem 0' }}>
            <div className="container">
              {/* Header Title & Subtitle */}
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
                  Browse Student Skills
                </h1>
                <p style={{ color: 'var(--slate-500)', fontSize: '1rem' }}>
                  Explore skills offered by students. Reach out to propose a peer-to-peer exchange.
                </p>
              </div>

              {/* Search and Filter Toolbar */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                  <Search
                    size={20}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--slate-400)'
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by skill name, topic, or keyword (e.g. React, Python, Figma, LeetCode)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.75rem', height: '46px', fontSize: '0.975rem' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.8rem',
                        color: 'var(--slate-400)',
                        padding: '0.2rem 0.5rem'
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Skills Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--slate-500)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading skill listings...</div>
                </div>
              ) : skills.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--slate-200)'
                }}>
                  <Sparkles size={40} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    No Skills Found
                  </h3>
                  <p style={{ color: 'var(--slate-500)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                    No skills matched your search filter. Be the first to share this skill with your peers!
                  </p>
                  <button
                    onClick={() => setIsAddSkillOpen(true)}
                    className="btn btn-primary"
                    style={{ gap: '0.5rem' }}
                  >
                    <PlusCircle size={18} />
                    <span>Offer This Skill</span>
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.25rem',
                    color: 'var(--slate-500)',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    <span>Showing {skills.length} available {skills.length === 1 ? 'skill' : 'skills'}</span>
                    <span>{selectedCategory !== 'All' ? `Filtered by ${selectedCategory}` : 'All Categories'}</span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {skills.map((skill) => (
                      <SkillCard
                        key={skill._id || skill.id}
                        skill={skill}
                        onSelect={setSelectedSkill}
                        onDelete={handleDeleteSkill}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onSkillAdded={handleSkillAdded}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
