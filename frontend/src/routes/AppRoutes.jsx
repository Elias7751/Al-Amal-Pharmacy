import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/public/Home';
import Shop from '../pages/public/Shop';
import ProductDetails from '../pages/public/ProductDetails';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Orders from '../pages/customer/Orders';
import Profile from '../pages/customer/Profile';
import Prescriptions from '../pages/customer/Prescriptions';
import Wishlist from '../pages/customer/Wishlist';
import Addresses from '../pages/customer/Addresses';

import AdminRoute from '../components/layout/AdminRoute';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminPrescriptions from '../pages/admin/AdminPrescriptions';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminInventory from '../pages/admin/AdminInventory';

// Placeholder components
const Placeholder = ({ title }) => <div style={{ padding: '4rem', textAlign: 'center' }}><h1>{title}</h1><p>Under construction...</p></div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/addresses" element={<Addresses />} />
      </Route>
      
      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
