import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [cartItems]);

  const addToCart = (course) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === course.id);
      if (exists) return prevItems;
      return [...prevItems, course];
    });
  };

  const removeFromCart = (courseId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const isInCart = (courseId) => {
    return cartItems.some((item) => item.id === courseId);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
