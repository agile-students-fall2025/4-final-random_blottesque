/**
 * API Client for Roomier Backend
 * Replaces mockApi.js with real API calls
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Token management
let authToken = localStorage.getItem('roomier_token');

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('roomier_token', token);
  } else {
    localStorage.removeItem('roomier_token');
  }
};

export const getAuthToken = () => authToken;

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// ==================== AUTH API ====================

export const signup = async (email, password, name) => {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  
  if (data.token) {
    setAuthToken(data.token);
    localStorage.setItem('roomier_user', JSON.stringify(data.user));
  }
  
  return data;
};

export const login = async (email, password) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (data.token) {
    setAuthToken(data.token);
    localStorage.setItem('roomier_user', JSON.stringify(data.user));
  }
  
  return data;
};

export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('roomier_user');
};

export const getCurrentUser = async () => {
  return apiRequest('/auth/me');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('roomier_user');
  return user ? JSON.parse(user) : null;
};

// ==================== USERS API ====================

export const getUser = async (id) => {
  return apiRequest(`/users/${id}`);
};

export const updateUser = async (id, userData) => {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// ==================== GROUPS API ====================

export const listGroups = async () => {
  return apiRequest('/groups');
};

export const getGroup = async (id) => {
  return apiRequest(`/groups/${id}`);
};

export const createGroup = async (groupData) => {
  return apiRequest('/groups', {
    method: 'POST',
    body: JSON.stringify(groupData),
  });
};

export const updateGroup = async (id, groupData) => {
  return apiRequest(`/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(groupData),
  });
};

export const deleteGroup = async (id) => {
  return apiRequest(`/groups/${id}`, {
    method: 'DELETE',
  });
};

export const joinGroupByCode = async (inviteCode) => {
  return apiRequest('/groups/join', {
    method: 'POST',
    body: JSON.stringify({ inviteCode }),
  });
};

// ==================== DASHBOARD API ====================

export const getDashboard = async (groupId) => {
  return apiRequest(`/groups/${groupId}/dashboard`);
};

// ==================== PREFERENCES API ====================

export const getPreferences = async (groupId) => {
  return apiRequest(`/groups/${groupId}/prefs`);
};

export const updatePreferences = async (groupId, prefs) => {
  return apiRequest(`/groups/${groupId}/prefs`, {
    method: 'PUT',
    body: JSON.stringify(prefs),
  });
};

// ==================== ROOMMATES API ====================

export const getRoommates = async (groupId) => {
  return apiRequest(`/groups/${groupId}/roommates`);
};

export const deleteRoommate = async (groupId, userId) => {
  return apiRequest(`/groups/${groupId}/roommates/${userId}`, {
    method: 'DELETE',
  });
};

// ==================== CHORES API ====================

export const getChores = async (groupId) => {
  return apiRequest(`/groups/${groupId}/chores`);
};

export const createChore = async (groupId, choreData) => {
  return apiRequest(`/groups/${groupId}/chores`, {
    method: 'POST',
    body: JSON.stringify(choreData),
  });
};

export const updateChore = async (groupId, choreId, choreData) => {
  return apiRequest(`/groups/${groupId}/chores/${choreId}`, {
    method: 'PUT',
    body: JSON.stringify(choreData),
  });
};

export const deleteChore = async (groupId, choreId) => {
  return apiRequest(`/groups/${groupId}/chores/${choreId}`, {
    method: 'DELETE',
  });
};

// ==================== EXPENSES API ====================

export const getExpenses = async (groupId) => {
  return apiRequest(`/groups/${groupId}/expenses`);
};

export const createExpense = async (groupId, expenseData) => {
  return apiRequest(`/groups/${groupId}/expenses`, {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
};

export const updateExpense = async (groupId, expenseId, expenseData) => {
  return apiRequest(`/groups/${groupId}/expenses/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  });
};

export const deleteExpense = async (groupId, expenseId) => {
  return apiRequest(`/groups/${groupId}/expenses/${expenseId}`, {
    method: 'DELETE',
  });
};

// ==================== INVENTORY API ====================

export const getInventory = async (groupId) => {
  return apiRequest(`/groups/${groupId}/inventory`);
};

export const createInventoryItem = async (groupId, itemData) => {
  return apiRequest(`/groups/${groupId}/inventory`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

export const updateInventoryItem = async (groupId, itemId, itemData) => {
  return apiRequest(`/groups/${groupId}/inventory/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  });
};

export const deleteInventoryItem = async (groupId, itemId) => {
  return apiRequest(`/groups/${groupId}/inventory/${itemId}`, {
    method: 'DELETE',
  });
};

// ==================== IMAGE UPLOAD API ====================

/**
 * Upload an image for profile or group
 * @param {string} type - 'profile' or 'group'
 * @param {string} id - User ID or Group ID
 * @param {File} file - The image file to upload
 */
export const uploadImage = async (type, id, file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/uploads/${type}/${id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
};

/**
 * Remove an image from profile or group
 * @param {string} type - 'profile' or 'group'
 * @param {string} id - User ID or Group ID
 */
export const removeImage = async (type, id) => {
  return apiRequest(`/uploads/${type}/${id}`, {
    method: 'DELETE'
  });
};

// Export all functions as default for backwards compatibility
export default {
  // Auth
  signup,
  login,
  logout,
  getCurrentUser,
  getStoredUser,
  setAuthToken,
  getAuthToken,
  
  // Users
  getUser,
  updateUser,
  
  // Groups
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroupByCode,
  getRoommates,
  deleteRoommate,
  
  // Dashboard
  getDashboard,
  
  // Preferences
  getPreferences,
  updatePreferences,
  
  // Chores
  getChores,
  createChore,
  updateChore,
  deleteChore,
  
  // Expenses
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  
  // Inventory
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  
  // Images
  uploadImage,
  removeImage,
};
