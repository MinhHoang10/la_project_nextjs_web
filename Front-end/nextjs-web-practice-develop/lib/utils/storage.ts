/**
 * Copyright(C) 2026 Luvina Software Company
 * storage.ts, 4/24/2026 NguyenHuyHoang
 */

/**
 * Tiện ích xử lý Web Storage (sessionStorage và localStorage).
 * Cung cấp các phương thức get, set, remove với JSON parse/stringify tự động.
 */
export const storage = {
  /**
   * Session Storage
   */
  session: {
    set: (key: string, value: any) => {
      if (typeof window === 'undefined') return;
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting session storage [${key}]:`, error);
      }
    },
    get: <T>(key: string): T | null => {
      if (typeof window === 'undefined') return null;
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting session storage [${key}]:`, error);
        return null;
      }
    },
    remove: (key: string) => {
      if (typeof window === 'undefined') return;
      sessionStorage.removeItem(key);
    },
    clear: () => {
      if (typeof window === 'undefined') return;
      sessionStorage.clear();
    }
  },

  /**
   * Local Storage
   */
  local: {
    set: (key: string, value: any) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting local storage [${key}]:`, error);
      }
    },
    get: <T>(key: string): T | null => {
      if (typeof window === 'undefined') return null;
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting local storage [${key}]:`, error);
        return null;
      }
    },
    remove: (key: string) => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    },
    clear: () => {
      if (typeof window === 'undefined') return;
      localStorage.clear();
    }
  }
};
