import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Requisitions from './pages/Requisitions';
import CreateRequisition from './pages/CreateRequisition';
import EditRequisition from './pages/EditRequisition';
import Inventory from './pages/Inventory';
import CreateInventoryItem from './pages/CreateInventoryItem';
import EditInventoryItem from './pages/EditInventoryItem';
import Vendors from './pages/Vendors';
import CreateVendor from './pages/CreateVendor';
import EditVendor from './pages/EditVendor';
import Approvals from './pages/Approvals';
import Reports from './pages/Reports';
import CustomReport from './pages/CustomReport';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requisitions" element={<Requisitions />} />
            <Route path="/requisitions/create" element={<CreateRequisition />} />
            <Route path="/requisitions/edit/:id" element={<EditRequisition />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/create" element={<CreateInventoryItem />} />
            <Route path="/inventory/edit/:id" element={<EditInventoryItem />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/create" element={<CreateVendor />} />
            <Route path="/vendors/edit/:id" element={<EditVendor />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/custom" element={<CustomReport />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;