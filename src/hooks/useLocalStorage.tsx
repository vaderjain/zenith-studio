import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get stored value or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Wrapper to set value
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      return nextValue;
    });
  }, []);

  // Clear value
  const clearValue = useCallback(() => {
    localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}

// Specific hooks for common persisted states
export function useOnboardingComplete() {
  return useLocalStorage<boolean>("onboarding_complete", false);
}

export function useICPData() {
  return useLocalStorage<object | null>("icp_data", null);
}

export function useSavedFilters() {
  return useLocalStorage<{
    segment: string;
    geography: string;
    industry: string;
    headcount: string;
    funding: string;
  }>("saved_filters", {
    segment: "all",
    geography: "all",
    industry: "all",
    headcount: "all",
    funding: "all",
  });
}
