

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
// pages
import { Auth } from './pages/Auth';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { ExpenseList } from './pages/ExpenseList';
import { GroceryTracker } from './pages/GroceryTracker';
import { AddGrocery } from './pages/AddGrocery';
import { Settings } from './pages/Settings';
import { Product } from './pages/Product';
import { AccountCreation } from './pages/AccountCreation';
import { CategoryCreation } from './pages/CategoryCreation';
import { ExpenseCreation } from './pages/ExpenseCreation';

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
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/expenses/create" element={<ExpenseCreation />} />
            <Route path="/accounts/create" element={<AccountCreation />} />
            <Route path="/categories/create" element={<CategoryCreation />} />
            <Route path="/grocery" element={<GroceryTracker />} />
            <Route path="/grocery/add" element={<AddGrocery />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/products" element={<Product />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
};

export default App;
