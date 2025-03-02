import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Récupérer les articles du panier depuis le localStorage au chargement
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (dish) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== dishId));
  };

  const updateQuantity = (dishId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(dishId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === dishId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}