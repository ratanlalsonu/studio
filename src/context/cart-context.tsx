
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, unit: string) => void;
  updateQuantity: (itemId: string, unit: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  isCartReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// A custom hook to manage state that syncs with localStorage
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
    const [isLoaded, setIsLoaded] = useState(false);
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        try {
            const stickyValue = window.localStorage.getItem(key);
            if (stickyValue !== null) {
                setValue(JSON.parse(stickyValue));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
        }
        setIsLoaded(true);
    }, [key]);

    useEffect(() => {
        if (isLoaded) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.warn(`Error setting localStorage key “${key}”:`, error);
            }
        }
    }, [key, value, isLoaded]);

    return [value, setValue, isLoaded];
}


export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems, isCartReady] = useStickyState<CartItem[]>([], 'cartItems');
  const { toast } = useToast();

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id && i.unit === item.unit);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && i.unit === item.unit
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevItems, item];
    });
    toast({
        title: "Added to cart",
        description: `${item.name} (${item.quantity} ${item.unit}) has been added to your cart.`,
    });
  }, [setCartItems, toast]);

  const removeFromCart = useCallback((itemId: string, unit: string) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.unit === unit)));
    toast({
        title: "Removed from cart",
        variant: 'destructive'
    });
  }, [setCartItems, toast]);

  const updateQuantity = useCallback((itemId: string, unit: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, unit);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId && item.unit === unit ? { ...item, quantity } : item
        )
      );
    }
  }, [setCartItems, removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  const cartCount = cartItems.reduce((count, item) => count + 1, 0);
  
  const totalPrice = cartItems.reduce((total, item) => {
    let itemPrice = item.price * item.quantity;
    if (item.unit === 'ml' || item.unit === 'g') {
      itemPrice = (item.price / 1000) * item.quantity;
    }
    return total + itemPrice;
  }, 0);


  const value = {
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      totalPrice,
      isCartReady,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
