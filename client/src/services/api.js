// Skill Swap API Client Service
const API_BASE = '/api';
const TOKEN_KEY = 'skillswap_jwt_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY)
};

const getHeaders = (includeAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = authStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

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
    if (params.userId) query.append('userId', params.userId);

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
      headers: getHeaders(true),
      body: JSON.stringify(skillData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create skill');
    }
    return res.json();
  },

  async updateSkill(id, skillData) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(skillData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update skill');
    }
    return res.json();
  },

  async deleteSkill(id) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete skill');
    }
    return res.json();
  },

  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    if (data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  },

  async getMe() {
    const token = authStorage.getToken();
    if (!token) return null;

    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(true)
    });

    if (!res.ok) {
      authStorage.clearToken();
      return null;
    }
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  },

  async getUserProfile(id) {
    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to fetch student profile');
    }
    return res.json();
  },

  logout() {
    authStorage.clearToken();
    localStorage.removeItem('skillswap_user');
  }
};
