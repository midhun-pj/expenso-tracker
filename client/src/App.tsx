

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
// pages
import { Auth } from './pages/Auth';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Settings } from './pages/Settings';
import { ProductList } from '@pages/ProductList';

const App: React.FC = () => {
  const { isAuthenticated } = useStore();

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
};

export default App;
