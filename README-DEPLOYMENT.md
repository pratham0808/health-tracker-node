# Health Tracker Deployment Guide

## Quick Deployment

After making changes to your code and pushing to GitHub, use these scripts to deploy to your EC2 server.

### Windows (PowerShell)

```powershell
.\deploy.ps1
```

### Linux/Mac (Bash)

```bash
chmod +x deploy.sh
./deploy.sh
```

## What the Script Does

1. **Pulls latest changes** from GitHub repository
2. **Installs dependencies** using npm install
3. **Builds the application** from TypeScript to JavaScript
4. **Restarts the application** using PM2
5. **Checks status** and tests the API health endpoint

## Prerequisites

- SSH key (`testnew.pem`) must be in `C:\Users\lenovo\Downloads\` (Windows) or `~/Downloads/` (Linux/Mac)
- Git repository must be pushed to GitHub before running the script
- EC2 instance must be running

## Manual Deployment Steps

If you prefer to deploy manually, SSH into the server and run:

```bash
# SSH into server
ssh -i C:\Users\lenovo\Downloads\testnew.pem ec2-user@13.127.133.213

# Navigate to app directory
cd health-tracker-node

# Pull latest changes
git pull origin master

# Install dependencies
npm install

# Build application
npm run build

# Restart with PM2
pm2 restart health-tracker-api

# Check status
pm2 status
```

## Useful PM2 Commands

```bash
# View logs
pm2 logs health-tracker-api

# Monitor in real-time
pm2 monit

# Restart app
pm2 restart health-tracker-api

# Stop app
pm2 stop health-tracker-api

# Start app
pm2 start health-tracker-api

# View detailed info
pm2 show health-tracker-api
```

## Troubleshooting

### If deployment fails:

1. **Check if EC2 is running:**
   ```bash
   ping 13.127.133.213
   ```

2. **Check application logs:**
   ```bash
   ssh -i C:\Users\lenovo\Downloads\testnew.pem ec2-user@13.127.133.213 "pm2 logs health-tracker-api --lines 50"
   ```

3. **Verify MongoDB is running:**
   ```bash
   ssh -i C:\Users\lenovo\Downloads\testnew.pem ec2-user@13.127.133.213 "sudo systemctl status mongod"
   ```

4. **Check if port 3000 is accessible:**
   ```bash
   curl http://13.127.133.213:3000/api/health
   ```

## API Endpoints

- **Base URL:** `http://13.127.133.213:3000`
- **Health Check:** `http://13.127.133.213:3000/api/health`
- **Auth Routes:** `/api/auth/*`
- **Exercise Routes:** `/api/exercises/*`
- **Log Routes:** `/api/logs/*`
- **Stats Routes:** `/api/stats/*`

## Server Details

- **Instance ID:** i-053339021a8aaab40
- **Public IP:** 13.127.133.213
- **OS:** Amazon Linux 2023
- **Node.js:** v18.20.8
- **MongoDB:** v7.0.25
- **PM2:** v6.0.13

## Security

- SSH Port: 22
- API Port: 3000
- MongoDB Port: 27017

All ports are configured in the security group `free-tier-ssh-sg`.

