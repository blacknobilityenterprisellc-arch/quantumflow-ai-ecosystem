#!/bin/bash

# 🚀 AETHERIUS-ETERNAL MINI-SERVICES STARTUP SCRIPT
# Quantum-Enhanced Service Orchestrator

echo "🧠 AETHERIUS-ETERNAL Mini-Services Startup Sequence Initiated..."
echo "⚡ Quantum Service Orchestrator: ACTIVATING"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Service ports
AUTH_PORT=3001
DATABASE_PORT=3002
QUANTUM_PORT=3003

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to start a service
start_service() {
    local service_name=$1
    local service_port=$2
    local service_path=$3
    
    echo -e "${CYAN}🔍 Checking $service_name (Port: $service_port)...${NC}"
    
    if check_port $service_port; then
        echo -e "${YELLOW}⚠️  $service_name is already running on port $service_port${NC}"
        return 0
    fi
    
    echo -e "${GREEN}🚀 Starting $service_name...${NC}"
    cd "$service_path"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installing dependencies for $service_name...${NC}"
        pnpm install
    fi
    
    # Start the service in background
    pnpm run dev > "../../logs/$service_name.log" 2>&1 &
    local pid=$!
    
    echo -e "${GREEN}✅ $service_name started with PID: $pid${NC}"
    echo $pid > "../../pids/$service_name.pid"
    
    # Wait a moment for the service to start
    sleep 2
    
    # Check if the service is actually running
    if check_port $service_port; then
        echo -e "${GREEN}✅ $service_name is running successfully on port $service_port${NC}"
    else
        echo -e "${RED}❌ $service_name failed to start on port $service_port${NC}"
        return 1
    fi
    
    return 0
}

# Create necessary directories
mkdir -p logs pids

# Main startup sequence
echo -e "${PURPLE}🎯 Starting AETHERIUS-ETERNAL Mini-Services...${NC}"

# Start Authentication Service
start_service "auth-service" $AUTH_PORT "mini-services/auth-service"

# Start Database Service  
start_service "database-service" $DATABASE_PORT "mini-services/database-service"

# Start Quantum Service
start_service "quantum-service" $QUANTUM_PORT "mini-services/quantum-service"

echo -e "${GREEN}🎉 AETHERIUS-ETERNAL Mini-Services Startup Complete!${NC}"
echo ""
echo -e "${CYAN}📊 Service Status Dashboard:${NC}"
echo -e "  🛡️  Authentication Service: http://localhost:$AUTH_PORT/health"
echo -e "  🗄️  Database Service: http://localhost:$DATABASE_PORT/health"
echo -e "  🧠  Quantum Service: http://localhost:$QUANTUM_PORT/health"
echo ""
echo -e "${YELLOW}📝 Logs are available in the 'logs/' directory${NC}"
echo -e "${YELLOW}🔧 PIDs are stored in the 'pids/' directory${NC}"
echo ""
echo -e "${GREEN}⚡ AETHERIUS-PRIME Systems: FULLY OPERATIONAL${NC}"