import { useState, useEffect, useCallback, useRef } from 'react';

const SYNC_EVENT_NAME = 'reps_local_storage_sync';

/**
 * Custom hook for localStorage with automatic cross-component synchronization,
 * defensive parsing, and stable ref handling to prevent infinite re-render loops.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Store initialValue in a ref so readValue doesn't change on every render
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  // Read value safely from localStorage
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined || item === 'null' || item === 'undefined') {
        return initialValueRef.current;
      }
      const parsed = JSON.parse(item) as T;
      if (parsed === null || parsed === undefined) {
        return initialValueRef.current;
      }
      return parsed;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Sync across tabs and other components when storage events occur
  useEffect(() => {
    // Synchronize to current storage on mount
    setStoredValue(readValue());

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string }>;
      if (!customEvent.detail || !customEvent.detail.key || customEvent.detail.key === key) {
        setStoredValue(readValue());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, [key, readValue]);

  // Setter function that writes to localStorage and broadcasts the update
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue(current => {
          const valueToStore = value instanceof Function ? value(current) : value;

          if (valueToStore === null || valueToStore === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }

          // Broadcast to all other hook instances in the application
          window.dispatchEvent(
            new CustomEvent(SYNC_EVENT_NAME, { detail: { key } })
          );

          return valueToStore;
        });
      } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
      }
    },
    [key]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValueRef.current);
      window.dispatchEvent(
        new CustomEvent(SYNC_EVENT_NAME, { detail: { key } })
      );
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Direct localStorage utility functions for use outside React components.
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined || item === 'null' || item === 'undefined') {
        return defaultValue;
      }
      const parsed = JSON.parse(item) as T;
      return parsed !== null && parsed !== undefined ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      window.dispatchEvent(
        new CustomEvent(SYNC_EVENT_NAME, { detail: { key } })
      );
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },

  remove(key: string): void {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT_NAME, { detail: { key } })
    );
  },

  clear(): void {
    window.localStorage.clear();
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: {} }));
  },
};
