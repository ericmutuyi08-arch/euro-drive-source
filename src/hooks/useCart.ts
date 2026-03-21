import { useState, useEffect, useCallback, useRef } from 'react';
import type { LocalCartItem } from '@/lib/types';

const CART_KEY = 'engine-cart';

function getStoredCart(): LocalCartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function useCart() {
  const [items, setItems] = useState<LocalCartItem[]>(getStoredCart);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    isInternalUpdate.current = true;
    window.dispatchEvent(new Event('cart-updated'));
    isInternalUpdate.current = false;
  }, [items]);

  useEffect(() => {
    const handler = () => {
      if (!isInternalUpdate.current) {
        setItems(getStoredCart());
      }
    };
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const addItem = useCallback((productId: string, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === productId);
      if (existing) {
        return prev.map(i => i.product_id === productId ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product_id: productId, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product_id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product_id !== productId));
    } else {
      setItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems };
}
