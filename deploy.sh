#!/bin/bash
# Health Tracker Node.js Deployment Script (Linux/Mac version)
# This script deploys the latest changes to your EC2 server

set -e

# Configuration
SSH_KEY="$HOME/Downloads/testnew.pem"
EC2_HOST="ec2-user@13.127.133.213"
APP_DIR="health-tracker-node"
APP_NAME="health-tracker-api"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "  Health Tracker Deployment Script"
echo -e "========================================${NC}"
echo ""

# Step 1: Pull latest changes from GitHub
echo -e "${YELLOW}[1/5] Pulling latest changes from GitHub...${NC}"
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && git pull origin master"
echo -e "${GREEN}✓ Successfully pulled latest changes${NC}"
echo ""

# Step 2: Install/Update dependencies
echo -e "${YELLOW}[2/5] Installing dependencies...${NC}"
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && npm install"
echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
echo ""

# Step 3: Build the application
echo -e "${YELLOW}[3/5] Building TypeScript application...${NC}"
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && npm run build"
echo -e "${GREEN}✓ Build completed successfully${NC}"
echo ""

# Step 4: Restart the application with PM2
echo -e "${YELLOW}[4/5] Restarting application...${NC}"
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_HOST" "pm2 restart $APP_NAME"
echo -e "${GREEN}✓ Application restarted successfully${NC}"
echo ""

# Step 5: Check application status
echo -e "${YELLOW}[5/5] Checking application status...${NC}"
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_HOST" "pm2 status $APP_NAME"
echo ""

# Test the health endpoint
echo -e "${YELLOW}Testing API health endpoint...${NC}"
sleep 2
if curl -s http://13.127.133.213:3000/api/health | grep -q "ok"; then
    echo -e "${GREEN}✓ API is responding correctly${NC}"
else
    echo -e "${RED}✗ API health check failed${NC}"
fi

echo ""
echo -e "${CYAN}========================================"
echo -e "${GREEN}  Deployment Completed Successfully!"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${CYAN}API URL: http://13.127.133.213:3000${NC}"
echo -e "${CYAN}Health Check: http://13.127.133.213:3000/api/health${NC}"

