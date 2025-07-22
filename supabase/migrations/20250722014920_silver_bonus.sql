-- Purchase Requisition Management System Database Schema
-- PostgreSQL Database Schema

-- Create database (run this separately as superuser)
-- CREATE DATABASE procurement_db;
-- \c procurement_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Malaysia',
    category VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0.0,
    payment_terms VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    total_orders INTEGER DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    current_stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    unit_of_measure VARCHAR(20) DEFAULT 'pcs',
    supplier_id UUID REFERENCES vendors(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requisitions table
CREATE TABLE requisitions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    cost_center VARCHAR(50),
    justification TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    expected_date DATE,
    vendor VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft',
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requisition items table
CREATE TABLE requisition_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_id INTEGER NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    total_price DECIMAL(12,2) DEFAULT 0.00,
    category VARCHAR(100),
    specifications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department VARCHAR(100) NOT NULL,
    fiscal_year INTEGER NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0.00,
    remaining_amount DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(department, fiscal_year)
);

-- Approval workflow table
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_id INTEGER NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    approval_level INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File attachments table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_id INTEGER NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    file_path VARCHAR(500) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_requisitions_user_id ON requisitions(user_id);
CREATE INDEX idx_requisitions_status ON requisitions(status);
CREATE INDEX idx_requisitions_department ON requisitions(department);
CREATE INDEX idx_requisitions_created_at ON requisitions(created_at);
CREATE INDEX idx_requisition_items_requisition_id ON requisition_items(requisition_id);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requisitions_updated_at BEFORE UPDATE ON requisitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role, department) VALUES 
('System Administrator', 'admin@company.com', '$2b$10$rQZ8kHWfQxwjKV.nVXJ0/.vQZ8kHWfQxwjKV.nVXJ0/.vQZ8kHWfQx', 'admin', 'Administration');

-- Insert sample departments budget
INSERT INTO budgets (department, fiscal_year, allocated_amount, remaining_amount) VALUES 
('IT', 2024, 50000.00, 50000.00),
('Marketing', 2024, 30000.00, 30000.00),
('Operations', 2024, 40000.00, 40000.00),
('HR', 2024, 20000.00, 20000.00),
('Finance', 2024, 15000.00, 15000.00),
('Administration', 2024, 25000.00, 25000.00);

-- Insert sample vendors
INSERT INTO vendors (name, contact_name, contact_email, contact_phone, category, rating, payment_terms) VALUES 
('Acme Office Supplies', 'John Smith', 'john@acme.com', '+60-3-1234-5678', 'Office Supplies', 4.8, '30 days'),
('TechCorp Solutions', 'Sarah Johnson', 'sarah@techcorp.com', '+60-3-2345-6789', 'IT Equipment', 4.6, '15 days'),
('Industrial Supplies Co', 'Mike Wilson', 'mike@industrial.com', '+60-3-3456-7890', 'Industrial', 4.2, '45 days');

-- Insert sample inventory items
INSERT INTO inventory (item_code, name, category, unit_price, current_stock, min_stock, max_stock) VALUES 
('OFF-001', 'A4 Paper Ream', 'Office Supplies', 8.50, 45, 20, 100),
('IT-001', 'Wireless Mouse', 'IT Equipment', 25.00, 5, 10, 50),
('FUR-001', 'Office Chair', 'Furniture', 150.00, 0, 5, 25),
('OFF-002', 'Printer Ink Cartridge', 'Office Supplies', 35.00, 25, 15, 60);

-- Insert system settings
INSERT INTO settings (key, value, description) VALUES 
('company_name', 'Your Company Name', 'Company name displayed in the system'),
('default_currency', 'MYR', 'Default currency for the system'),
('approval_threshold_1', '1000', 'First approval threshold amount'),
('approval_threshold_2', '5000', 'Second approval threshold amount'),
('fiscal_year_start', '1', 'Fiscal year start month (1-12)'),
('email_notifications', 'true', 'Enable email notifications');