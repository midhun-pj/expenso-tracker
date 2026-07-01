

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
import { SupermarketList } from '@pages/SupermarketList';
import { AccountList } from '@pages/Accounts';
import { Groceries } from '@pages/Groceries';
import { AddGrocery } from '@components/grocery/AddGrocery';
import { GroceryHistory } from '@pages/GroceryHistory';

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
            <Route path="/supermarkets" element={<SupermarketList />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/groceries" element={<Groceries />} />
            <Route path="/groceries/add" element={<AddGrocery />} />
            <Route path="/groceries/history/:productId" element={<GroceryHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
};

export default App;
