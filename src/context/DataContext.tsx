import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataContextType {
  requisitions: any[];
  inventory: any[];
  vendors: any[];
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [requisitions, setRequisitions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [vendors, setVendors] = useState([]);

  const refreshData = () => {
    // Simulate data refresh
    console.log('Refreshing data...');
  };

  useEffect(() => {
    // Initialize data
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ requisitions, inventory, vendors, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}