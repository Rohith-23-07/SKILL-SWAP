// Skill Swap API Client Service
const API_BASE = '/api';

export const api = {
  // System Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Skills
  async getSkills(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.level && params.level !== 'All') query.append('level', params.level);

    const url = `${API_BASE}/skills${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  async getSkillById(id) {
    const res = await fetch(`${API_BASE}/skills/${id}`);
    if (!res.ok) throw new Error('Skill not found');
    return res.json();
  },

  async createSkill(skillData) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create skill');
    }
    return res.json();
  },

  async deleteSkill(id) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  }
};
