import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MY_CATEGORIES } from '../screens/usta-main/data';

const UstaDataContext = createContext(null);

/**
 * Bir nechta ekran (bosh sahifa, buyurtmalar, daromad, kategoriya tafsiloti)
 * ishlatadigan usta kategoriyalari holati.
 */
export function UstaDataProvider({ children }) {
  const [categories, setCategories] = useState(MY_CATEGORIES);

  // Asosiy (isPrimary) kategoriya bitta bo'lishi kerak.
  const updateCategory = useCallback((id, updates) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) return { ...c, ...updates };
        if (updates.isPrimary) return { ...c, isPrimary: false };
        return c;
      })
    );
  }, []);

  const value = useMemo(() => ({ categories, updateCategory }), [categories, updateCategory]);

  return <UstaDataContext.Provider value={value}>{children}</UstaDataContext.Provider>;
}

export function useUstaData() {
  const ctx = useContext(UstaDataContext);
  if (!ctx) throw new Error('useUstaData UstaDataProvider ichida ishlatilishi kerak');
  return ctx;
}
