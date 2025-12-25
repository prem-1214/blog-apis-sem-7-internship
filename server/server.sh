#!/bin/bash

# ========================================
# Blog API Server Startup Script
# ========================================
# This script handles:
# 1. Cleanup of existing containers
# 2. Environment validation
# 3. Building and starting all services
# ========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Blog API Server Startup Script${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Cleanup existing containers
echo -e "\n${YELLOW}[1/5] Stopping and removing existing containers...${NC}"
docker-compose down --remove-orphans 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Cleanup completed${NC}"
else
    echo -e "${YELLOW}! No existing containers to clean${NC}"
fi

# Step 2: Remove dangling images (optional cleanup)
echo -e "\n${YELLOW}[2/5] Cleaning up dangling images...${NC}"
docker image prune -f 2>/dev/null
echo -e "${GREEN}✓ Image cleanup completed${NC}"

# Step 3: Check for .env file
echo -e "\n${YELLOW}[3/5] Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found!${NC}"
    if [ -f .env.sample ]; then
        echo -e "${YELLOW}Creating .env from .env.sample...${NC}"
        cp .env.sample .env
        echo -e "${RED}⚠ Please update .env with your actual values:${NC}"
        echo -e "  - ACCESS_TOKEN_SECRET"
        echo -e "  - ACCESS_TOKEN_EXPIRY"
        echo -e "  - REFRESH_TOKEN_SECRET"
        echo -e "  - REFRESH_TOKEN_EXPIRY"
        echo -e "  - MONGODB_URI (use mongodb://mongo:27017/ for Docker)"
        echo -e "  - REDIS_URL (use redis://redis:6379 for Docker)"
        echo -e "${RED}Then run this script again.${NC}"
        exit 1
    else
        echo -e "${RED}✗ .env.sample not found! Please create .env file manually.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file found${NC}"
fi

# Step 4: Build and start containers
echo -e "\n${YELLOW}[4/5] Building and starting containers...${NC}"
docker-compose up --build -d

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to start containers!${NC}"
    exit 1
fi

# Wait for containers to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 5

# Step 5: Show status
echo -e "\n${YELLOW}[5/5] Container Status:${NC}"
docker-compose ps

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   Server started successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e ""
echo -e "  ${BLUE}API:${NC}      http://localhost:3000"
echo -e "  ${BLUE}MongoDB:${NC}  localhost:27017"
echo -e "  ${BLUE}Redis:${NC}    localhost:6379"
echo -e ""
echo -e "${YELLOW}Showing logs (Press Ctrl+C to exit logs)...${NC}"
echo -e ""

# Follow logs
docker-compose logs -f
