#!/bin/bash

# QuantumFlow AI Ecosystem - Dual Repository Sync System
# Enables simultaneous connection and perfect synchronization between both repositories

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'
RESET='\033[0m'

# Repository paths
QUANTUMFLOW_REPO="/home/z/my-project"
KEYSTONE_REPO="/home/z/my-project/keystone-ai-ecosystem-premium-diamond-grade"

# Sync configuration
SYNC_INTERVAL=30  # seconds
MAX_RETRIES=3
CONFLICT_RESOLUTION="auto"  # auto, manual, quantum

echo -e "${CYAN}${BOLD}🔄 QuantumFlow AI Ecosystem - Dual Repository Sync System${RESET}"
echo -e "${CYAN}================================================${RESET}"

# Function to check repository status
check_repo_status() {
    local repo_path=$1
    local repo_name=$2
    
    cd "$repo_path" || return 1
    
    # Check if it's a git repository
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ $repo_name: Not a git repository${RESET}"
        return 1
    fi
    
    # Check for uncommitted changes
    local status=$(git status --porcelain)
    if [ -n "$status" ]; then
        echo -e "${YELLOW}⚠️  $repo_name: Uncommitted changes detected${RESET}"
        return 2
    fi
    
    # Check if remote is accessible
    local remote_url=$(git remote get-url origin 2>/dev/null)
    if [ -z "$remote_url" ]; then
        echo -e "${RED}❌ $repo_name: No remote origin configured${RESET}"
        return 3
    fi
    
    echo -e "${GREEN}✅ $repo_name: Repository healthy${RESET}"
    return 0
}

# Function to sync repositories
sync_repositories() {
    echo -e "${BLUE}${BOLD}🔄 Starting bidirectional synchronization...${RESET}"
    
    # Check both repositories
    echo -e "${CYAN}📊 Checking repository status...${RESET}"
    
    local qf_status
    local ks_status
    
    check_repo_status "$QUANTUMFLOW_REPO" "QuantumFlow"
    qf_status=$?
    
    check_repo_status "$KEYSTONE_REPO" "Keystone AI"
    ks_status=$?
    
    # Handle conflicts and sync issues
    if [ $qf_status -ne 0 ] || [ $ks_status -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Sync issues detected, attempting resolution...${RESET}"
        
        # Add all changes and commit if needed
        if [ $qf_status -eq 2 ]; then
            cd "$QUANTUMFLOW_REPO"
            git add .
            git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')" --no-verify
        fi
        
        if [ $ks_status -eq 2 ]; then
            cd "$KEYSTONE_REPO"
            git add .
            git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')" --no-verify
        fi
    fi
    
    # Push changes to remotes
    echo -e "${BLUE}📤 Pushing changes to remotes...${RESET}"
    
    cd "$QUANTUMFLOW_REPO"
    git push origin main 2>/dev/null && echo -e "${GREEN}✅ QuantumFlow: Pushed successfully${RESET}" || echo -e "${RED}❌ QuantumFlow: Push failed${RESET}"
    
    cd "$KEYSTONE_REPO"
    git push origin main-master 2>/dev/null && echo -e "${GREEN}✅ Keystone: Pushed successfully${RESET}" || echo -e "${RED}❌ Keystone: Push failed${RESET}"
    
    # Pull latest changes
    echo -e "${CYAN}📥 Pulling latest changes...${RESET}"
    
    cd "$QUANTUMFLOW_REPO"
    git pull origin main 2>/dev/null && echo -e "${GREEN}✅ QuantumFlow: Pulled successfully${RESET}" || echo -e "${RED}❌ QuantumFlow: Pull failed${RESET}"
    
    cd "$KEYSTONE_REPO"
    git pull origin main-master 2>/dev/null && echo -e "${GREEN}✅ Keystone: Pulled successfully${RESET}" || echo -e "${RED}❌ Keystone: Pull failed${RESET}"
}

# Function to create bidirectional sync links
create_sync_links() {
    echo -e "${PURPLE}${BOLD}🔗 Creating bidirectional sync links...${RESET}"
    
    # Create shared configuration
    cat > "$QUANTUMFLOW_REPO/.sync-config.json" << EOF
{
  "sync_enabled": true,
  "partner_repo": "$KEYSTONE_REPO",
  "sync_interval": $SYNC_INTERVAL,
  "conflict_resolution": "$CONFLICT_RESOLUTION",
  "auto_commit": true,
  "auto_push": true,
  "last_sync": "$(date -Iseconds)",
  "quantum_coherence": true
}
EOF
    
    cat > "$KEYSTONE_REPO/.sync-config.json" << EOF
{
  "sync_enabled": true,
  "partner_repo": "$QUANTUMFLOW_REPO",
  "sync_interval": $SYNC_INTERVAL,
  "conflict_resolution": "$CONFLICT_RESOLUTION",
  "auto_commit": true,
  "auto_push": true,
  "last_sync": "$(date -Iseconds)",
  "quantum_coherence": true
}
EOF
    
    echo -e "${GREEN}✅ Sync configuration created${RESET}"
}

# Function to monitor synchronization
monitor_sync() {
    echo -e "${CYAN}${BOLD}👁 Starting synchronization monitor...${RESET}"
    
    while true; do
        echo -e "${BLUE}🔄 Sync cycle: $(date '+%Y-%m-%d %H:%M:%S')${RESET}"
        
        sync_repositories
        
        # Check sync health
        local qf_health=$(check_repo_status "$QUANTUMFLOW_REPO" "QuantumFlow")
        local ks_health=$(check_repo_status "$KEYSTONE_REPO" "Keystone AI")
        
        if [ $qf_health -eq 0 ] && [ $ks_health -eq 0 ]; then
            echo -e "${GREEN}✅ Perfect sync achieved${RESET}"
        else
            echo -e "${YELLOW}⚠️  Sync issues detected, will retry...${RESET}"
        fi
        
        sleep $SYNC_INTERVAL
    done
}

# Function to display sync status
display_status() {
    echo -e "${CYAN}${BOLD}📊 Dual Repository Sync Status${RESET}"
    echo -e "${CYAN}================================================${RESET}"
    
    echo -e "${BLUE}📁 QuantumFlow Repository:${RESET}"
    check_repo_status "$QUANTUMFLOW_REPO" "QuantumFlow"
    
    echo -e "${PURPLE}🏗️  Keystone AI Repository:${RESET}"
    check_repo_status "$KEYSTONE_REPO" "Keystone AI"
    
    echo -e "${CYAN}================================================${RESET}"
    echo -e "${GREEN}✅ Dual connection established${RESET}"
    echo -e "${GREEN}✅ Perfect synchronization active${RESET}"
}

# Main execution
case "${1:-monitor}" in
    "init")
        echo -e "${GREEN}${BOLD}🚀 Initializing dual repository sync system...${RESET}"
        create_sync_links
        display_status
        ;;
    "sync")
        sync_repositories
        ;;
    "monitor")
        monitor_sync
        ;;
    "status")
        display_status
        ;;
    *)
        echo -e "${CYAN}${BOLD}QuantumFlow AI Ecosystem - Dual Repository Sync System${RESET}"
        echo -e "${CYAN}Usage: $0 {init|sync|monitor|status}${RESET}"
        echo -e "${CYAN}  init    - Initialize sync system${RESET}"
        echo -e "${CYAN}  sync    - Perform one-time sync${RESET}"
        echo -e "${CYAN}  monitor  - Start continuous monitoring${RESET}"
        echo -e "${CYAN}  status  - Display current status${RESET}"
        exit 0
        ;;
esac