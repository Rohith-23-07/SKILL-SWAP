import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Users, RefreshCw, ShieldCheck, Code, Compass } from 'lucide-react';

export default function HeroSection({ onExplore, onOfferSkill, totalSkills }) {
  return (
    <div>
      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)',
        padding: '4rem 0 3.5rem 0',
        borderBottom: '1px solid var(--slate-200)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background blobs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Top Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#ffffff',
            border: '1px solid #c7d2fe',
            boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} />
            <span>Empowering Student Collaborative Learning</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--slate-900)',
            maxWidth: '850px',
            margin: '0 auto 1.25rem auto',
            lineHeight: 1.15
          }}>
            Teach what you love. <br />
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Learn what you need.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--slate-600)',
            maxWidth: '650px',
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.6
          }}>
            Skill Swap is a peer-to-peer student platform. Exchange your programming,
            design, or language skills with fellow students — completely free of cost.
          </p>

          {/* Call to Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <button 
              onClick={onExplore}
              className="btn btn-primary btn-lg"
              style={{ gap: '0.6rem' }}
            >
              <Compass size={20} />
              <span>Browse Skills</span>
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={onOfferSkill}
              className="btn btn-secondary btn-lg"
              style={{ gap: '0.6rem', boxShadow: 'var(--shadow-sm)' }}
            >
              <BookOpen size={20} />
              <span>Offer a Skill</span>
            </button>
          </div>

          {/* Live Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            maxWidth: '920px',
            margin: '0 auto'
          }}>
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                {totalSkills || 6}+
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                Active Student Skills
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.2rem' }}>
                100%
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                Free Peer Exchange
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginBottom: '0.2rem' }}>
                Verified
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                University Peers
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.2rem' }}>
                Zero Cost
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                Knowledge Barter
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--primary)',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem'
            }}>
              Simple 3-Step Process
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              How Skill Swap Works
            </h2>
            <p style={{ color: 'var(--slate-500)', maxWidth: '500px', margin: '0.5rem auto 0 auto' }}>
              No tuition, no subscriptions. Exchange knowledge peer-to-peer.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>1. List Your Skills</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.55 }}>
                Post what you are proficient in (like React, Python, Figma, or conversational languages) and what you want in return.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#ecfeff',
                color: '#0891b2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>2. Connect With Peers</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.55 }}>
                Browse hundreds of student listings. Filter by category, proficiency level, or search directly for specific topics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <RefreshCw size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>3. Swap & Learn</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.55 }}>
                Connect 1-on-1, schedule collaboration sessions, and accelerate your practical skills together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
