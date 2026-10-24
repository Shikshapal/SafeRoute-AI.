/**
 * API Service for SafeRoute AI
 * Handles communication with the Flask backend.
 */

const API_BASE = '/api';

/**
 * Helper to fetch with timeout and JSON parsing
 */
async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection or backend server.');
    }
    throw error;
  }
}

export const api = {
  // Health check
  checkHealth: () => apiRequest('/health'),

  // Emergency helplines
  getHelplines: () => apiRequest('/emergency/helplines'),

  // Safety tips
  getSafetyTips: (category = null) => {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest(`/safety/tips${query}`);
  },

  getSafetyCategories: () => apiRequest('/safety/categories'),

  // Routing and Geocoding
  geocodeLocation: (query) => apiRequest(`/routes/geocode?q=${encodeURIComponent(query)}`),

  reverseGeocode: (lat, lon) => apiRequest(`/routes/reverse-geocode?lat=${lat}&lon=${lon}`),

  planRoute: (start, destination, travelMode = 'driving') => {
    return apiRequest('/routes/plan', {
      method: 'POST',
      body: JSON.stringify({
        start,
        destination,
        travel_mode: travelMode
      })
    });
  },

  // AI Safety Assistant
  sendAiMessage: (message, history = []) => {
    return apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        history
      })
    });
  }
};

