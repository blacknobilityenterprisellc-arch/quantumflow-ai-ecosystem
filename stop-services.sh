#!/bin/bash

# 🛑 AETHERIUS-ETERNAL MINI-SERVICES SHUTDOWN SCRIPT
# Quantum-Enhanced Service Deactivator

echo "🧠 AETHERIUS-ETERNAL Mini-Services Shutdown Sequence Initiated..."
echo "⚡ Quantum Service Orchestrator: DEACTIVATING"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to stop a service
stop_service() {
    local service_name=$1
    local pid_file="pids/$service_name.pid"
    
    echo -e "${CYAN}🛑 Stopping $service_name...${NC}"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            echo -e "${GREEN}✅ $service_name (PID: $pid) stopped successfully${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name (PID: $pid) was not running${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  PID file for $service_name not found${NC}"
    fi
}

# Main shutdown sequence
echo -e "${PURPLE}🎯 Stopping AETHERIUS-ETERNAL Mini-Services...${NC}"

# Stop all services
stop_service "auth-service"
stop_service "database-service" 
stop_service "quantum-service"

# Clean up any remaining processes on the service ports
echo -e "${CYAN}🧹 Cleaning up remaining processes...${NC}"
for port in 3001 3002 3003; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}⚠️  Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null
    fi
done

echo -e "${GREEN}🎉 AETHERIUS-ETERNAL Mini-Services Shutdown Complete!${NC}"
echo -e "${BLUE}😴 All quantum systems entering standby mode${NC}"