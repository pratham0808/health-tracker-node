# Health Tracker Node.js Deployment Script
# This script deploys the latest changes to your EC2 server

$ErrorActionPreference = "Stop"

# Configuration
$SSH_KEY = "C:\Users\lenovo\Downloads\testnew.pem"
$EC2_HOST = "ec2-user@13.127.133.213"
$APP_DIR = "health-tracker-node"
$APP_NAME = "health-tracker-api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Health Tracker Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Pull latest changes from GitHub
Write-Host "[1/5] Pulling latest changes from GitHub..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_HOST 'cd health-tracker-node && git pull origin master'
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to pull changes from GitHub" -ForegroundColor Red
    exit 1
}
Write-Host "Successfully pulled latest changes" -ForegroundColor Green
Write-Host ""

# Step 2: Install/Update dependencies
Write-Host "[2/5] Installing dependencies..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_HOST 'cd health-tracker-node && npm install'
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Build the application
Write-Host "[3/5] Building TypeScript application..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_HOST 'cd health-tracker-node && npm run build'
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Build completed successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Restart the application with PM2
Write-Host "[4/5] Restarting application..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_HOST 'pm2 restart health-tracker-api'
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to restart application" -ForegroundColor Red
    exit 1
}
Write-Host "Application restarted successfully" -ForegroundColor Green
Write-Host ""

# Step 5: Check application status
Write-Host "[5/5] Checking application status..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_HOST 'pm2 status health-tracker-api'
Write-Host ""

# Health check removed - using ALB instead of direct IP access
Write-Host "Health check skipped - using ALB endpoint" -ForegroundColor Yellow

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API URL: https://api.mygeogames.com/api" -ForegroundColor Cyan
Write-Host "Health Check: https://api.mygeogames.com/api/health" -ForegroundColor Cyan
