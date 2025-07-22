import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatMYR } from '../utils/currency';
import { sendRequisitionNotification, getApprovalRecipients } from '../services/emailService';

export default function CreateRequisition() {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    costCenter: '',
    justification: '',
    priority: 'normal',
    expectedDate: '',
    vendor: '',
    currency: 'MYR'
  });

  const [items, setItems] = useState([
    {
      id: 1,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: '',
      specifications: ''
    }
  ]);

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: '',
      specifications: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmitForApproval = async () => {
    try {
      // Generate requisition ID
      const requisitionId = `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Get approval recipients based on department and amount
      const recipients = getApprovalRecipients(formData.department, totalAmount * 1.1);
      
      // Send email notification
      const emailSent = await sendRequisitionNotification({
        to: recipients,
        subject: `New Purchase Requisition: ${requisitionId} - ${formatMYR(totalAmount * 1.1)}`,
        body: '', // Body is generated in the service
        requisitionId,
        amount: formatMYR(totalAmount * 1.1),
        requestor: 'Current User', // In real app, get from auth context
        department: formData.department
      });
      
      if (emailSent) {
        alert(`Requisition ${requisitionId} submitted successfully! Notifications sent to approvers.`);
        // In real app, redirect to requisitions list or show success message
      } else {
        alert('Requisition submitted but email notifications failed. Please contact IT support.');
      }
    } catch (error) {
      console.error('Error submitting requisition:', error);
      alert('Failed to submit requisition. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/requisitions"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Purchase Requisition</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details for your new purchase request
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            Save as Draft
          </button>
          <button 
            onClick={handleSubmitForApproval}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Submit for Approval
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requisition Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a descriptive title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="IT">Information Technology</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Center
                </label>
                <input
                  type="text"
                  value={formData.costCenter}
                  onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                  placeholder="Enter cost center code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Justification *
                </label>
                <textarea
                  rows={3}
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  placeholder="Explain why this purchase is necessary"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
              <button
                onClick={addItem}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        <option value="office-supplies">Office Supplies</option>
                        <option value="it-equipment">IT Equipment</option>
                        <option value="furniture">Furniture</option>
                        <option value="software">Software</option>
                        <option value="services">Services</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total: {formatMYR(item.total)}
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specifications
                    </label>
                    <textarea
                      rows={2}
                      value={item.specifications}
                      onChange={(e) => updateItem(item.id, 'specifications', e.target.value)}
                      placeholder="Additional specifications or requirements"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <button className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload
                  </button>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Items:</span>
                <span className="text-sm font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium">{formatMYR(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax (10%):</span>
                <span className="text-sm font-medium">{formatMYR(totalAmount * 0.1)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatMYR(totalAmount * 1.1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Chain */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Chain</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Department Manager</p>
                  <p className="text-xs text-gray-500">Auto-assigned</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Finance Team</p>
                  <p className="text-xs text-gray-500">If amount {'>'} RM 1,000</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">CEO Approval</p>
                  <p className="text-xs text-gray-500">If amount {'>'} RM 5,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Provide detailed item descriptions</li>
              <li>• Include vendor quotes when available</li>
              <li>• Specify delivery requirements clearly</li>
              <li>• Justify business need thoroughly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}