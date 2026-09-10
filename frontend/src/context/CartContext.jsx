import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setTotalPrice(0);
      return;
    }
    try {
      const { data } = await api.get('/cart');
      if (data.success) {
        setCart(data.cart);
        setTotalPrice(data.total_price);
      }
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product_id, quantity = 1) => {
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }
    try {
      const { data } = await api.post('/cart', { product_id, quantity });
      if (data.success) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const removeFromCart = async (product_id) => {
    try {
      const { data } = await api.delete(`/cart/${product_id}`);
      if (data.success) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete('/cart');
      if (data.success) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error clearing cart", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, totalPrice, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
