import React from 'react';
import { Code, Brain, Palette, Cloud, Globe, GraduationCap, LayoutGrid } from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Programming', icon: Code },
  { name: 'AI & Data Science', icon: Brain },
  { name: 'Design', icon: Palette },
  { name: 'DevOps & Cloud', icon: Cloud },
  { name: 'Languages', icon: Globe },
  { name: 'Academic', icon: GraduationCap }
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      overflowX: 'auto',
      paddingBottom: '0.75rem',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.name;

        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
              color: isSelected ? '#ffffff' : 'var(--slate-600)',
              border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--slate-300)'}`,
              boxShadow: isSelected ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'var(--shadow-sm)'
            }}
          >
            <Icon size={16} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
