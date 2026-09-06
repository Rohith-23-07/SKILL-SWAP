import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, AlertCircle, CheckCircle2, ArrowLeftRight, Sparkles, Filter, BookOpen } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryFilter from './components/CategoryFilter';
import SkillCard from './components/SkillCard';
import SkillDetailModal from './components/SkillDetailModal';
import AddSkillModal from './components/AddSkillModal';
import AuthModal from './components/AuthModal';
import ProfileView from './components/ProfileView';
import EditProfileModal from './components/EditProfileModal';
import UserProfileModal from './components/UserProfileModal';
import Footer from './components/Footer';
import { api, authStorage } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'browse' | 'profile' | 'my-skills'
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
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

  // Restore authenticated session on mount
  useEffect(() => {
    checkHealth();
    fetchSkills();

    // Verify token & restore session from backend
    const checkSession = async () => {
      const token = authStorage.getToken();
      if (token) {
        try {
          const res = await api.getMe();
          if (res && res.success && res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('skillswap_user', JSON.stringify(res.user));
          } else {
            api.logout();
            setCurrentUser(null);
          }
        } catch (e) {
          api.logout();
          setCurrentUser(null);
        }
      }
    };

    checkSession();
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
    showToast(`Welcome, ${user.name}!`);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('You have been logged out.');
    if (activeTab === 'profile' || activeTab === 'my-skills') {
      setActiveTab('home');
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
    showToast('Profile updated successfully!');
    fetchSkills();
  };

  const handleSkillAdded = (newSkill) => {
    setSkills((prev) => [newSkill, ...prev]);
    showToast('Your skill listing has been published!');
    setActiveTab('browse');
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => (s._id !== id && s.id !== id)));
      showToast('Skill listing deleted successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to delete skill.', 'error');
    }
  };

  // Compute skills belonging to the current user
  const currentUserId = (currentUser?.id || currentUser?._id)?.toString();
  const userSkills = skills.filter((s) => {
    const authorId = (s.user?.id || s.user?._id)?.toString();
    return currentUserId && authorId && currentUserId === authorId;
  });

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
        onOpenAddSkill={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
            showToast('Please log in to offer a skill', 'error');
          } else {
            setIsAddSkillOpen(true);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* VIEW 1: HOME LANDING */}
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onExplore={() => setActiveTab('browse')}
              onOfferSkill={() => {
                if (!currentUser) {
                  setIsAuthOpen(true);
                  showToast('Please log in to offer a skill', 'error');
                } else {
                  setIsAddSkillOpen(true);
                }
              }}
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
                        currentUser={currentUser}
                        onSelect={setSelectedSkill}
                        onDelete={handleDeleteSkill}
                        onViewUser={(id) => setViewingUserId(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: BROWSE SKILLS */}
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
                    onClick={() => {
                      if (!currentUser) {
                        setIsAuthOpen(true);
                        showToast('Please log in to offer a skill', 'error');
                      } else {
                        setIsAddSkillOpen(true);
                      }
                    }}
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
                        currentUser={currentUser}
                        onSelect={setSelectedSkill}
                        onDelete={handleDeleteSkill}
                        onViewUser={(id) => setViewingUserId(id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: USER PROFILE */}
        {activeTab === 'profile' && currentUser && (
          <ProfileView
            currentUser={currentUser}
            userSkills={userSkills}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenAddSkill={() => setIsAddSkillOpen(true)}
            onSelectSkill={setSelectedSkill}
            onDeleteSkill={handleDeleteSkill}
          />
        )}

        {/* VIEW 4: MY SKILLS */}
        {activeTab === 'my-skills' && currentUser && (
          <div style={{ padding: '2.5rem 0 4rem 0' }}>
            <div className="container">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--slate-900)' }}>
                    My Skill Listings
                  </h1>
                  <p style={{ color: 'var(--slate-500)', fontSize: '1rem' }}>
                    Manage and track skills you are currently offering to student peers.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddSkillOpen(true)}
                  className="btn btn-primary"
                  style={{ gap: '0.4rem' }}
                >
                  <PlusCircle size={18} />
                  <span>Offer a New Skill</span>
                </button>
              </div>

              {userSkills.length === 0 ? (
                <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <BookOpen size={48} style={{ color: 'var(--slate-300)', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    You haven't listed any skills yet
                  </h3>
                  <p style={{ color: 'var(--slate-500)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                    List a skill you can teach to start receiving exchange proposals from classmates!
                  </p>
                  <button
                    onClick={() => setIsAddSkillOpen(true)}
                    className="btn btn-primary"
                    style={{ gap: '0.4rem' }}
                  >
                    <PlusCircle size={18} />
                    <span>Create a Listing</span>
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {userSkills.map((skill) => (
                    <SkillCard
                      key={skill._id || skill.id}
                      skill={skill}
                      currentUser={currentUser}
                      onSelect={setSelectedSkill}
                      onDelete={handleDeleteSkill}
                      onViewUser={(id) => setViewingUserId(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* Skill Detail & Swap Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        currentUser={currentUser}
        onClose={() => setSelectedSkill(null)}
        onViewUser={(id) => setViewingUserId(id)}
      />

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onSkillAdded={handleSkillAdded}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Student Public Profile Modal */}
      <UserProfileModal
        userId={viewingUserId}
        onClose={() => setViewingUserId(null)}
        onSelectSkill={(skill) => {
          setSelectedSkill(skill);
        }}
      />
    </div>
  );
}
