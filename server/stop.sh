#!/bin/bash

# ========================================
# Blog API Server Stop Script
# ========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Blog API Server Stop Script${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Stop containers
echo -e "\n${YELLOW}[1/3] Stopping containers...${NC}"
docker-compose down

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Containers stopped successfully${NC}"
else
    echo -e "${RED}✗ Error stopping containers${NC}"
    exit 1
fi

# Step 2: Optional - Remove orphan containers
echo -e "\n${YELLOW}[2/3] Removing orphan containers...${NC}"
docker-compose down --remove-orphans 2>/dev/null
echo -e "${GREEN}✓ Orphan cleanup completed${NC}"

# Step 3: Show status
echo -e "\n${YELLOW}[3/3] Current Docker status:${NC}"
docker ps --filter "name=blog" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   Server stopped successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e ""
echo -e "To start again, run: ${BLUE}sh server.sh${NC}"
