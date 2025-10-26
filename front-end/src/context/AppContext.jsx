import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../lib/mockApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.listGroups().then((gs) => {
      if (!mounted) return;
      setGroups(gs);
      setActiveGroupId(gs[0]?.id ?? null);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const value = useMemo(() => ({
    loading,
    groups,
    activeGroupId,
    setActiveGroupId,
    async createGroup(input) {
      const created = await api.createGroup(input);
      setGroups((prev) => [created, ...prev]);
      setActiveGroupId(created.id);
      return created;
    },
    async updateGroup(id, patch) {
      const updated = await api.updateGroup(id, patch);
      setGroups((prev) => prev.map(g => g.id === id ? updated : g));
      return updated;
    },
    getActiveGroup() {
      return groups.find(g => g.id === activeGroupId) || null;
    },
    async getDashboard(groupId) {
      return api.getDashboard(groupId);
    }
  }), [groups, activeGroupId, loading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
