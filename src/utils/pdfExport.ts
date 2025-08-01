import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatMYR } from './currency';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportRequisitionToPDF = (requisition: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text('ProcureFlow', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Purchase Requisition', 20, 35);
  
  // Requisition details
  doc.setFontSize(12);
  doc.text(`Requisition ID: ${requisition.id}`, 20, 50);
  doc.text(`Title: ${requisition.title}`, 20, 60);
  doc.text(`Requestor: ${requisition.requestor}`, 20, 70);
  doc.text(`Department: ${requisition.department}`, 20, 80);
  doc.text(`Date: ${requisition.date}`, 20, 90);
  doc.text(`Status: ${requisition.status.toUpperCase()}`, 20, 100);
  doc.text(`Total Amount: ${formatMYR(requisition.amount)}`, 20, 110);
  
  // Items table
  const items = requisition.items || [
    { description: 'Sample Item 1', quantity: 2, unitPrice: 100, total: 200 },
    { description: 'Sample Item 2', quantity: 1, unitPrice: 150, total: 150 }
  ];
  
  doc.autoTable({
    startY: 125,
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: items.map((item: any) => [
      item.description,
      item.quantity,
      formatMYR(item.unitPrice),
      formatMYR(item.total)
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 10 }
  });
  
  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated by ProcureFlow System', 20, finalY + 20);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, finalY + 30);
  
  doc.save(`requisition-${requisition.id}.pdf`);
};

export const exportInventoryToPDF = (inventory: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ProcureFlow', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Inventory Report', 20, 35);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
  doc.text(`Total Items: ${inventory.length}`, 20, 60);
  
  // Inventory table
  doc.autoTable({
    startY: 75,
    head: [['Item Code', 'Name', 'Category', 'Stock', 'Unit Price', 'Status']],
    body: inventory.map((item: any) => [
      item.id,
      item.name,
      item.category,
      `${item.currentStock}/${item.maxStock}`,
      formatMYR(item.unitPrice),
      item.status
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 }
  });
  
  doc.save('inventory-report.pdf');
};

export const exportVendorsToPDF = (vendors: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ProcureFlow', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Vendor Report', 20, 35);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
  doc.text(`Total Vendors: ${vendors.length}`, 20, 60);
  
  // Vendors table
  doc.autoTable({
    startY: 75,
    head: [['Vendor ID', 'Name', 'Category', 'Rating', 'Orders', 'Total Value', 'Status']],
    body: vendors.map((vendor: any) => [
      vendor.id,
      vendor.name,
      vendor.category,
      vendor.rating,
      vendor.totalOrders,
      formatMYR(vendor.totalValue),
      vendor.status
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 }
  });
  
  doc.save('vendor-report.pdf');
};

export const exportDashboardToPDF = (dashboardData: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ProcureFlow', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Dashboard Report', 20, 35);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
  
  // Key metrics
  doc.setFontSize(14);
  doc.text('Key Metrics', 20, 70);
  
  doc.setFontSize(12);
  doc.text(`Total Requisitions: ${dashboardData.totalRequisitions || '1,247'}`, 20, 85);
  doc.text(`Pending Approvals: ${dashboardData.pendingApprovals || '23'}`, 20, 95);
  doc.text(`Active Vendors: ${dashboardData.activeVendors || '156'}`, 20, 105);
  doc.text(`Budget Utilized: ${dashboardData.budgetUtilized || '68%'}`, 20, 115);
  
  // Recent activity
  doc.setFontSize(14);
  doc.text('Recent Activity', 20, 135);
  
  const activities = dashboardData.recentActivity || [
    'John Manager approved requisition REQ-2024-001',
    'Jane Smith created new requisition REQ-2024-005',
    'Mike Johnson updated vendor information',
    'Sarah Wilson submitted for approval REQ-2024-004'
  ];
  
  doc.setFontSize(10);
  activities.forEach((activity: string, index: number) => {
    doc.text(`• ${activity}`, 25, 150 + (index * 10));
  });
  
  doc.save('dashboard-report.pdf');
};

export const exportCustomReportToPDF = (reportData: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ProcureFlow', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(reportData.title || 'Custom Report', 20, 35);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
  doc.text(`Date Range: ${reportData.dateRange || 'All Time'}`, 20, 60);
  doc.text(`Department: ${reportData.department || 'All Departments'}`, 20, 70);
  
  // Report content
  if (reportData.data && reportData.data.length > 0) {
    doc.autoTable({
      startY: 85,
      head: [reportData.headers || ['Item', 'Value', 'Status']],
      body: reportData.data,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 }
    });
  }
  
  doc.save(`custom-report-${Date.now()}.pdf`);
};