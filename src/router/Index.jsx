import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Login from '../pages/Login';
import ProductList from '../pages/ProductList';
import ProtectedRoutes from './ProtectedRoutes';

const Index = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Login Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoutes>
                <ProductList />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoutes>
                <ProductList />
              </ProtectedRoutes>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default Index;
