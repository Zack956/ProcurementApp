#!/bin/bash

# Deployment script for Purchase Requisition Management System
# Run this script to deploy updates to your Linux server

set -e

APP_DIR="/opt/procureflow"
BACKUP_DIR="/opt/procureflow-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== Deploying Purchase Requisition Management System ==="

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

# Copy new files (assuming they're in current directory)
echo "Copying application files..."
cp -r . $APP_DIR/
chown -R procureflow:procureflow $APP_DIR

# Install/update dependencies
echo "Installing dependencies..."
cd $APP_DIR
sudo -u procureflow npm install

# Build application
echo "Building application..."
sudo -u procureflow npm run build

# Run database migrations if needed
echo "Running database migrations..."
if [ -f "$APP_DIR/database/migrations.sql" ]; then
    sudo -u procureflow psql -d procurement_db -f $APP_DIR/database/migrations.sql
fi

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
else
    echo "❌ Deployment failed. Check logs with: journalctl -u procureflow -f"
    exit 1
fi

echo ""
echo "Deployment completed at $(date)"
echo "Application is running at: http://$(hostname -I | awk '{print $1}')"