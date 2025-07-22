import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Requisitions from './pages/Requisitions';
import CreateRequisition from './pages/CreateRequisition';
import Inventory from './pages/Inventory';
import Vendors from './pages/Vendors';
import Approvals from './pages/Approvals';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="flex h-screen bg-gray-50">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/requisitions" element={<Requisitions />} />
                  <Route path="/requisitions/create" element={<CreateRequisition />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;