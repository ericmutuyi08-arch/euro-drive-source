import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'engine-wishlist';

function getStored(): string[] {
  try {
    const s = localStorage.getItem(WISHLIST_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

export function useWishlist() {
  const [items, setItems] = useState<string[]>(getStored);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const toggle = useCallback((productId: string) => {
    setItems(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback((productId: string) => items.includes(productId), [items]);

  return { wishlistIds: items, toggle, isWishlisted, count: items.length };
}
