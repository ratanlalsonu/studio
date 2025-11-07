"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
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
  };

  const removeFromCart = (itemId: string, unit: string) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.unit === unit)));
    toast({
        title: "Removed from cart",
        variant: 'destructive'
    });
  };

  const updateQuantity = (itemId: string, unit: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, unit);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId && item.unit === unit ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + 1, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice }}>
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
