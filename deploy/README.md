# Purchase Requisition Management System - Deployment Guide

## 🚀 Quick Deployment from Git

### Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- Root or sudo access
- Internet connection
- Git repository with your project

### Step 1: Download Installation Script

```bash
# Download the installation script
wget https://raw.githubusercontent.com/your-username/your-repo/main/deploy/install.sh

# Make it executable
chmod +x install.sh
```

### Step 2: Run Installation

```bash
# Run as root or with sudo
sudo ./install.sh
```

The script will:
1. Ask for your Git repository URL
2. Install all required dependencies (Node.js, PostgreSQL, Nginx, PM2)
3. Clone your repository
4. Set up the database
5. Configure the web server
6. Start all services

### Step 3: Access Your Application

After installation, your application will be available at:
- **URL**: `http://your-server-ip`
- **Default Admin**: `admin@company.com` / `admin123`

## 🔄 Updating Your Application

To deploy updates from Git:

```bash
# Download update script
wget https://raw.githubusercontent.com/your-username/your-repo/main/deploy/deploy.sh
chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh
```

## 📋 Manual Installation Steps

If you prefer manual installation:

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install other tools
sudo apt install -y nginx git
sudo npm install -g pm2
```

### 2. Clone Repository

```bash
# Create user and directory
sudo useradd -m -s /bin/bash procureflow
sudo mkdir -p /opt/procureflow
sudo chown procureflow:procureflow /opt/procureflow

# Clone repository
sudo -u procureflow git clone YOUR_GIT_REPO_URL /opt/procureflow
```

### 3. Setup Database

```bash
# Create database and user
sudo -u postgres createuser procureflow
sudo -u postgres createdb procurement_db -O procureflow

# Set password (replace 'your_password' with a secure password)
sudo -u postgres psql -c "ALTER USER procureflow PASSWORD 'your_password';"

# Import schema
sudo -u procureflow psql -d procurement_db -f /opt/procureflow/supabase/migrations/20250722014920_silver_bonus.sql
```

### 4. Configure Application

```bash
cd /opt/procureflow

# Create environment file
sudo -u procureflow cp .env.example .env
sudo -u procureflow nano .env  # Edit with your settings

# Install dependencies and build
sudo -u procureflow npm install
sudo -u procureflow npm run build
```

### 5. Configure Web Server

```bash
# Copy Nginx configuration
sudo cp deploy/nginx.conf /etc/nginx/sites-available/procureflow
sudo ln -s /etc/nginx/sites-available/procureflow /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Copy systemd service
sudo cp deploy/procureflow.service /etc/systemd/system/
sudo systemctl daemon-reload
```

### 6. Start Services

```bash
# Enable and start services
sudo systemctl enable postgresql nginx procureflow
sudo systemctl start postgresql nginx procureflow
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=procurement_db
DB_USER=procureflow
DB_PASSWORD=your_secure_password

# Server
PORT=3001
NODE_ENV=production
JWT_SECRET=your_jwt_secret

# Email (configure with your SMTP settings)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@company.com
```

### Email Configuration for Outlook

For Outlook/Office 365 email notifications:

```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-company-email@outlook.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@company.com
```

## 🛠️ Maintenance Commands

```bash
# Check application status
sudo systemctl status procureflow

# View application logs
sudo journalctl -u procureflow -f

# Restart application
sudo systemctl restart procureflow

# Update from Git
cd /opt/procureflow
sudo -u procureflow git pull
sudo -u procureflow npm install
sudo -u procureflow npm run build
sudo systemctl restart procureflow

# Database backup
sudo -u procureflow pg_dump procurement_db > backup_$(date +%Y%m%d).sql

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔒 Security Considerations

1. **Change default passwords** immediately after installation
2. **Configure firewall** to only allow necessary ports
3. **Set up SSL certificate** for HTTPS (recommended: Let's Encrypt)
4. **Regular backups** of database and application files
5. **Keep system updated** with security patches

## 🆘 Troubleshooting

### Application won't start
```bash
# Check logs
sudo journalctl -u procureflow -f

# Check if port is in use
sudo netstat -tlnp | grep :3001

# Restart services
sudo systemctl restart procureflow nginx
```

### Database connection issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
sudo -u procureflow psql -d procurement_db -c "SELECT version();"
```

### Email notifications not working
1. Verify SMTP settings in `.env`
2. Check if your email provider requires app passwords
3. Ensure firewall allows outbound SMTP connections

## 📞 Support

For issues or questions:
1. Check the application logs: `sudo journalctl -u procureflow -f`
2. Verify all services are running: `sudo systemctl status procureflow nginx postgresql`
3. Check the troubleshooting section above