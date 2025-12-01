import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as api from '../lib/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      try {
        // Check for stored user
        const storedUser = api.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }

        // Fetch groups from API
        const groupsData = await api.listGroups();
        
        if (!mounted) return;
        
        setGroups(groupsData);
        
        // Set active group to first one if available
        if (groupsData.length > 0) {
          // Use _id from MongoDB or fallback to id
          const firstGroupId = groupsData[0]._id || groupsData[0].id;
          setActiveGroupId(firstGroupId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    initializeApp();
    return () => { mounted = false; };
  }, []);

  // Auth functions
  const login = useCallback(async (email, password) => {
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      
      // Refresh groups after login
      const groupsData = await api.listGroups();
      setGroups(groupsData);
      if (groupsData.length > 0) {
        setActiveGroupId(groupsData[0]._id || groupsData[0].id);
      }
      
      return data;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  }, []);

  const signup = useCallback(async (email, password, name) => {
    try {
      const data = await api.signup(email, password, name);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    setGroups([]);
    setActiveGroupId(null);
  }, []);

  // Group functions
  const createGroup = useCallback(async (input) => {
    try {
      const created = await api.createGroup(input);
      setGroups((prev) => [created, ...prev]);
      setActiveGroupId(created._id || created.id);
      return created;
    } catch (err) {
      console.error('Create group failed:', err);
      throw err;
    }
  }, []);

  const updateGroup = useCallback(async (id, patch) => {
    try {
      const updated = await api.updateGroup(id, patch);
      setGroups((prev) => prev.map(g => {
        const gid = g._id || g.id;
        return gid === id ? updated : g;
      }));
      return updated;
    } catch (err) {
      console.error('Update group failed:', err);
      throw err;
    }
  }, []);

  const deleteGroup = useCallback(async (id) => {
    try {
      await api.deleteGroup(id);
      setGroups((prev) => prev.filter(g => (g._id || g.id) !== id));
      if (activeGroupId === id && groups.length > 1) {
        const remaining = groups.filter(g => (g._id || g.id) !== id);
        setActiveGroupId(remaining[0]?._id || remaining[0]?.id || null);
      }
    } catch (err) {
      console.error('Delete group failed:', err);
      throw err;
    }
  }, [activeGroupId, groups]);

  const getActiveGroup = useCallback(() => {
    return groups.find(g => (g._id || g.id) === activeGroupId) || null;
  }, [groups, activeGroupId]);

  const getDashboard = useCallback(async (groupId) => {
    try {
      return await api.getDashboard(groupId);
    } catch (err) {
      console.error('Get dashboard failed:', err);
      throw err;
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    try {
      const groupsData = await api.listGroups();
      setGroups(groupsData);
      return groupsData;
    } catch (err) {
      console.error('Refresh groups failed:', err);
      throw err;
    }
  }, []);

  const value = useMemo(() => ({
    // State
    loading,
    error,
    groups,
    activeGroupId,
    user,
    
    // State setters
    setActiveGroupId,
    setUser,
    
    // Auth
    login,
    signup,
    logout,
    
    // Groups
    createGroup,
    updateGroup,
    deleteGroup,
    getActiveGroup,
    getDashboard,
    refreshGroups,
    
    // API access for direct calls
    api,
  }), [
    loading,
    error,
    groups,
    activeGroupId,
    user,
    login,
    signup,
    logout,
    createGroup,
    updateGroup,
    deleteGroup,
    getActiveGroup,
    getDashboard,
    refreshGroups,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
