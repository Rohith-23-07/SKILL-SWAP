import React from 'react';
import { User, Building2, Mail, Calendar, Edit3, PlusCircle, BookOpen, ArrowLeftRight, Trash2 } from 'lucide-react';
import SkillCard from './SkillCard';

export default function ProfileView({
  currentUser,
  userSkills = [],
  onOpenEditProfile,
  onOpenAddSkill,
  onSelectSkill,
  onDeleteSkill
}) {
  if (!currentUser) return null;

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Profile Card Header */}
        <div className="card" style={{
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle top accent gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            {/* Left: Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #e0e7ff',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                  {currentUser.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={16} />
                    <span>{currentUser.university || 'University Student'}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={16} />
                    <span>{currentUser.email}</span>
                  </span>
                  {currentUser.createdAt && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={16} />
                      <span>Joined {new Date(currentUser.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Edit Button */}
            <button
              onClick={onOpenEditProfile}
              className="btn btn-secondary"
              style={{ gap: '0.45rem' }}
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Bio */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-100)' }}>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.4rem' }}>
              About Me
            </h4>
            <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {currentUser.bio || 'No bio added yet. Click "Edit Profile" to share what you study and what projects you are working on!'}
            </p>
          </div>

          {/* Skills Offered & Wanted Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginTop: '1.5rem'
          }}>
            {/* Skills Offered */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#16a34a',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <BookOpen size={16} />
                <span>Skills You Offer to Teach</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {currentUser.skillsOffered && currentUser.skillsOffered.length > 0 ? (
                  currentUser.skillsOffered.map((skill, idx) => (
                    <span key={idx} className="badge badge-academic" style={{ fontSize: '0.825rem' }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                    Add skills you are proficient in so other students know what you can teach!
                  </span>
                )}
              </div>
            </div>

            {/* Skills Wanted */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <ArrowLeftRight size={16} />
                <span>Skills You Want to Learn</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {currentUser.skillsWanted && currentUser.skillsWanted.length > 0 ? (
                  currentUser.skillsWanted.map((skill, idx) => (
                    <span key={idx} className="badge badge-programming" style={{ fontSize: '0.825rem' }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                    Add skills you want to learn to help find ideal peer partners!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User's Skill Listings */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                My Skill Listings ({userSkills.length})
              </h2>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                Skills you have published to the student community.
              </p>
            </div>
            <button
              onClick={onOpenAddSkill}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <PlusCircle size={16} />
              <span>Offer a New Skill</span>
            </button>
          </div>

          {userSkills.length === 0 ? (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <BookOpen size={36} style={{ color: 'var(--slate-300)', margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                You haven't listed any skills yet
              </h3>
              <p style={{ color: 'var(--slate-500)', maxWidth: '440px', margin: '0 auto 1.25rem auto', fontSize: '0.9rem' }}>
                Offer a skill you know well (like React, Python, UI Design, or Languages) to start matching with other students.
              </p>
              <button
                onClick={onOpenAddSkill}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <PlusCircle size={18} />
                <span>Create Your First Skill Listing</span>
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
                  onSelect={onSelectSkill}
                  onDelete={onDeleteSkill}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
