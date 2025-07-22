#!/bin/bash

# Purchase Requisition Management System - Linux Server Installation Script
# Run this script as root or with sudo privileges

set -e

echo "=== Purchase Requisition Management System Installation ==="
echo "This script will install and configure the system on your Linux server"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or with sudo"
    exit 1
fi

# Update system packages
echo "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "Installing required packages..."
apt install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates

# Install Node.js 18.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
echo "Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Install PM2 for process management
echo "Installing PM2..."
npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
apt install -y nginx

# Create application user
echo "Creating application user..."
useradd -m -s /bin/bash procureflow || true
usermod -aG sudo procureflow

# Create application directory
echo "Setting up application directory..."
mkdir -p /opt/procureflow
chown procureflow:procureflow /opt/procureflow

# Setup PostgreSQL
echo "Setting up PostgreSQL..."
sudo -u postgres createuser procureflow || true
sudo -u postgres createdb procurement_db -O procureflow || true

# Generate random passwords
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

# Set PostgreSQL password
sudo -u postgres psql -c "ALTER USER procureflow PASSWORD '$DB_PASSWORD';"

# Create .env file
echo "Creating environment configuration..."
cat > /opt/procureflow/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=procurement_db
DB_USER=procureflow
DB_PASSWORD=$DB_PASSWORD

# Server Configuration
PORT=3001
NODE_ENV=production
JWT_SECRET=$JWT_SECRET

# Email Configuration (Update these with your SMTP settings)
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@company.com

# Frontend URL
FRONTEND_URL=http://$(hostname -I | awk '{print $1}')

# File Upload Configuration
UPLOAD_PATH=/opt/procureflow/uploads
MAX_FILE_SIZE=10485760
EOF

# Set proper permissions
chown procureflow:procureflow /opt/procureflow/.env
chmod 600 /opt/procureflow/.env

# Create uploads directory
mkdir -p /opt/procureflow/uploads
chown procureflow:procureflow /opt/procureflow/uploads

# Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/procureflow << 'EOF'
server {
    listen 80;
    server_name _;
    
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /opt/procureflow/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable Nginx site
ln -sf /etc/nginx/sites-available/procureflow /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Configure firewall
echo "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create systemd service for the application
echo "Creating systemd service..."
cat > /etc/systemd/system/procureflow.service << 'EOF'
[Unit]
Description=Purchase Requisition Management System
After=network.target postgresql.service

[Service]
Type=simple
User=procureflow
WorkingDirectory=/opt/procureflow
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable services
systemctl enable postgresql
systemctl enable nginx
systemctl enable procureflow

echo ""
echo "=== Installation Complete ==="
echo ""
echo "Next steps:"
echo "1. Copy your application files to /opt/procureflow/"
echo "2. Run the database setup: sudo -u procureflow psql -d procurement_db -f /opt/procureflow/database/schema.sql"
echo "3. Install dependencies: cd /opt/procureflow && sudo -u procureflow npm install"
echo "4. Build the application: sudo -u procureflow npm run build"
echo "5. Start services: systemctl start procureflow nginx"
echo ""
echo "Database credentials:"
echo "  Username: procureflow"
echo "  Password: $DB_PASSWORD"
echo "  Database: procurement_db"
echo ""
echo "Default admin login:"
echo "  Email: admin@company.com"
echo "  Password: admin123"
echo ""
echo "Server will be available at: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "Remember to:"
echo "- Update email settings in /opt/procureflow/.env"
echo "- Change the default admin password after first login"
echo "- Configure SSL certificate for production use"