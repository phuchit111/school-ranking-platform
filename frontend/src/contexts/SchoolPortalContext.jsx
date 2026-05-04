'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { clearTokens } from '@/lib/auth';

const SchoolPortalContext = createContext(null);

export function SchoolPortalProvider({ children }) {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/auth/me');
        if (data.role !== 'SCHOOL_ADMIN' || !data.schoolId) {
          if (data.role === 'ADMIN') {
            router.replace('/admin/dashboard');
          } else {
            router.replace('/admin/login');
          }
          setMe(null);
          return;
        }
      setMe(data);
    } catch {
      router.replace('/admin/login');
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      /* ignore */
    }
    clearTokens();
    router.replace('/admin/login');
  }, [router]);

  const value = useMemo(
    () => ({
      me,
      loading,
      schoolId: me?.schoolId ?? null,
      refresh: loadMe,
      logout,
    }),
    [me, loading, loadMe, logout]
  );

  if (loading && !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        กำลังโหลด...
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <SchoolPortalContext.Provider value={value}>{children}</SchoolPortalContext.Provider>
  );
}

export function useSchoolPortal() {
  const ctx = useContext(SchoolPortalContext);
  if (!ctx) {
    throw new Error('useSchoolPortal must be used inside SchoolPortalProvider');
  }
  return ctx;
}
