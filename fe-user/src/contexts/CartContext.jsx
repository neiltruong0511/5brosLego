import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isCartShaking, setIsCartShaking] = useState(false);
  const { user } = useAuth();

  const updateCartCount = async () => {
    try {
      const response = await api.get('/cart');
      const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
      
      // Trigger shake animation
      setIsCartShaking(true);
      setTimeout(() => setIsCartShaking(false), 500);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  useEffect(() => {
    if (user) {
      updateCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      isCartShaking, 
      updateCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);