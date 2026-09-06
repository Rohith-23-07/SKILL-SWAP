import React from 'react';
import { ArrowLeftRight, Github, Heart, Globe, Cloud } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--slate-200)',
      padding: '3rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Col 1: About */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '0.8rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <ArrowLeftRight size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                Skill<span style={{ color: 'var(--primary)' }}>Swap</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
              A peer-to-peer knowledge sharing and skill exchange platform built for students
              to collaborate, build real-world skills, and grow together.
            </p>
          </div>

          {/* Col 2: Project Architecture */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.75rem' }}>
              Cloud & DA Architecture
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>• Frontend: React 18 + Vite</li>
              <li>• Backend: Node.js + Express REST APIs</li>
              <li>• Database: MongoDB Atlas (Cloud)</li>
              <li>• Deployment Ready & Microservices Capable</li>
            </ul>
          </div>

          {/* Col 3: Student Community */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.75rem' }}>
              Student Community
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>• Free Knowledge Exchange</li>
              <li>• Skill Swap Protocol</li>
              <li>• Student Verified Listings</li>
              <li>• Cross-Discipline Collaboration</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--slate-200)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--slate-500)'
        }}>
          <div>
            © 2026 Skill Swap Platform • Built for Cloud Applications & Distributed Systems.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Cloud size={15} color="var(--primary)" />
              <span>Cloud Ready</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Github size={15} />
              <span>GitHub Versioned</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
