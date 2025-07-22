#!/bin/bash

# Deployment script for Purchase Requisition Management System
# Run this script to deploy updates from Git to your Linux server

set -e

APP_DIR="/opt/procureflow"
BACKUP_DIR="/opt/procureflow-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== Deploying Purchase Requisition Management System ==="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or with sudo"
    exit 1
fi

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "Application directory not found. Please run install.sh first."
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Stop the application
echo "Stopping application..."
systemctl stop procureflow || true

# Create backup
echo "Creating backup..."
if [ -d "$APP_DIR" ]; then
    tar -czf "$BACKUP_DIR/procureflow_backup_$TIMESTAMP.tar.gz" -C /opt procureflow
    echo "Backup created: $BACKUP_DIR/procureflow_backup_$TIMESTAMP.tar.gz"
fi

# Pull latest changes from Git
echo "Pulling latest changes from Git..."
cd $APP_DIR
sudo -u procureflow git fetch origin
sudo -u procureflow git reset --hard origin/main

# Install/update dependencies
echo "Installing dependencies..."
sudo -u procureflow npm install

# Build application
echo "Building application..."
sudo -u procureflow npm run build

# Run database migrations if needed
echo "Checking for database migrations..."
if [ -f "$APP_DIR/supabase/migrations/20250722014920_silver_bonus.sql" ]; then
    echo "Database schema is available"
    # You can add migration logic here if needed
else
    echo "No database migrations found"
fi

# Ensure proper permissions
chown -R procureflow:procureflow $APP_DIR
chmod 600 $APP_DIR/.env

# Start application
echo "Starting application..."
systemctl start procureflow

# Restart Nginx
echo "Restarting Nginx..."
systemctl restart nginx

# Check status
sleep 5
if systemctl is-active --quiet procureflow; then
    echo "✅ Application deployed successfully!"
    echo "Status: $(systemctl is-active procureflow)"
    echo "Application is running at: http://$(hostname -I | awk '{print $1}')"
else
    echo "❌ Deployment failed. Check logs with: journalctl -u procureflow -f"
    echo ""
    echo "Rollback option available:"
    echo "To restore from backup: tar -xzf $BACKUP_DIR/procureflow_backup_$TIMESTAMP.tar.gz -C /opt && systemctl restart procureflow"
    exit 1
fi

echo ""
echo "Deployment completed at $(date)"
echo ""
echo "Useful commands:"
echo "  - View logs: journalctl -u procureflow -f"
echo "  - Check status: systemctl status procureflow"
echo "  - Restart: systemctl restart procureflow"