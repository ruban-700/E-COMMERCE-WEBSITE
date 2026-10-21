import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, CartItem, CartCalculationResult } from '../types/index.ts';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variantId?: number | null, quantity?: number) => void;
  updateQuantity: (productId: number, variantId: number | null | undefined, quantity: number) => void;
  removeFromCart: (productId: number, variantId?: number | null) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  calculation: CartCalculationResult | null;
  loadingCalculation: boolean;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  giftNote: string;
  setGiftNote: (note: string) => void;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'beepri_cart_v1';
const GIFT_NOTE_KEY = 'beepri_gift_note';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [giftNote, setGiftNoteState] = useState(() => {
    return localStorage.getItem(GIFT_NOTE_KEY) || '';
  });
  const [calculation, setCalculation] = useState<CartCalculationResult | null>(null);
  const [loadingCalculation, setLoadingCalculation] = useState(false);

  const setGiftNote = (note: string) => {
    setGiftNoteState(note);
    localStorage.setItem(GIFT_NOTE_KEY, note);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Server calculation
  const recalculateServer = useCallback(async (cartItems: CartItem[], coupon: string) => {
    if (cartItems.length === 0) {
      setCalculation({
        items: [],
        subtotal: 0,
        shippingFee: 0,
        discountAmount: 0,
        totalAmount: 0,
        coupon: null,
        freeShippingThreshold: 999,
        amountToFreeShipping: 999,
      });
      return;
    }

    setLoadingCalculation(true);
    try {
      const payload = {
        items: cartItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
        })),
        couponCode: coupon,
      };

      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setCalculation(data);
      }
    } catch (err) {
      console.error('Failed to recalculate cart:', err);
    } finally {
      setLoadingCalculation(false);
    }
  }, []);

  useEffect(() => {
    recalculateServer(items, couponCode);
  }, [items, couponCode, recalculateServer]);

  const addToCart = (product: Product, variantId?: number | null, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && (i.variantId ?? null) === (variantId ?? null)
      );

      const chosenVariant = product.variants?.find((v) => v.id === variantId) || null;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          product,
          selectedVariant: chosenVariant,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            variantId: variantId || null,
            quantity,
            product,
            selectedVariant: chosenVariant,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (
    productId: number,
    variantId: number | null | undefined,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId && (i.variantId ?? null) === (variantId ?? null)) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const removeFromCart = (productId: number, variantId?: number | null) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && (i.variantId ?? null) === (variantId ?? null))
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setGiftNoteState('');
    localStorage.removeItem(GIFT_NOTE_KEY);
    setCalculation(null);
  };

  const applyCoupon = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: 'Please enter a coupon code' };

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, subtotal: calculation?.subtotal || 0 }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponCode(clean);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
    } catch {
      return { success: false, message: 'Could not validate coupon' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        calculation,
        loadingCalculation,
        couponCode,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        giftNote,
        setGiftNote,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
