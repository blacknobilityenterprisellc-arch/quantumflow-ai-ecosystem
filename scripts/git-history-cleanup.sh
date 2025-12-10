#!/bin/bash

# 🛡️ AETHERIUS-PRIME GIT HISTORY CLEANUP
# Remove secrets from Git history safely

set -e

echo "🧹 AETHERIUS-PRIME GIT HISTORY CLEANUP"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Safety checks
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not a Git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ You have uncommitted changes${NC}"
    echo -e "${YELLOW}   Please commit or stash your changes first${NC}"
    exit 1
fi

# Backup current state
echo -e "${BLUE}📋 Creating backup...${NC}"
BACKUP_BRANCH="backup-before-cleanup-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo -e "${GREEN}✅ Backup created: $BACKUP_BRANCH${NC}"

# Function to remove secrets from history
remove_secrets_from_history() {
    echo -e "${BLUE}🔍 Scanning for secrets in Git history...${NC}"
    
    # Check for common secret patterns in Git history
    local secrets_found=false
    
    # Search for API keys
    if git log --all --full-history --grep="sk-[a-zA-Z0-9]{48}" --oneline 2>/dev/null | grep -q .; then
        echo -e "${YELLOW}⚠️  OpenAI API keys found in history${NC}"
        secrets_found=true
    fi
    
    # Search for Google AI keys
    if git log --all --full-history --grep="AIza[a-zA-Z0-9_-]{35}" --oneline 2>/dev/null | grep -q .; then
        echo -e "${YELLOW}⚠️  Google AI API keys found in history${NC}"
        secrets_found=true
    fi
    
    # Search for AWS keys
    if git log --all --full-history --grep="AKIA[0-9A-Z]{16}" --oneline 2>/dev/null | grep -q .; then
        echo -e "${YELLOW}⚠️  AWS Access Keys found in history${NC}"
        secrets_found=true
    fi
    
    # Search for password/secret mentions
    if git log --all --full-history --grep="password\|secret\|token\|credential" --oneline 2>/dev/null | grep -q .; then
        echo -e "${YELLOW}⚠️  Password/secret mentions found in history${NC}"
        secrets_found=true
    fi
    
    if [ "$secrets_found" = true ]; then
        echo -e "${RED}🚨 SECRETS FOUND IN GIT HISTORY${NC}"
        echo ""
        echo -e "${BLUE}📋 CLEANUP OPTIONS:${NC}"
        echo "1. BFG Repo-Cleaner (recommended)"
        echo "2. git-filter-repo (alternative)"
        echo "3. Manual selective removal"
        echo ""
        
        read -p "Choose cleanup method (1/2/3): " choice
        
        case $choice in
            1)
                echo -e "${BLUE}🔧 Using BFG Repo-Cleaner...${NC}"
                if ! command -v bfg > /dev/null; then
                    echo -e "${YELLOW}⚠️  BFG Repo-Cleaner not found${NC}"
                    echo -e "${YELLOW}   Install with: brew install bfg || wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar${NC}"
                    exit 1
                fi
                
                # Create BFG replacement file
                echo "password" > secrets.txt
                echo "secret" >> secrets.txt
                echo "token" >> secrets.txt
                echo "api_key" >> secrets.txt
                echo "credential" >> secrets.txt
                
                # Run BFG
                bfg --replace-text secrets.txt --delete-files "*.env" "*.key" "*.pem" "secrets.txt" "credentials.json"
                
                # Cleanup
                rm secrets.txt
                
                echo -e "${GREEN}✅ BFG cleanup completed${NC}"
                ;;
            2)
                echo -e "${BLUE}🔧 Using git-filter-repo...${NC}"
                if ! command -v git-filter-repo > /dev/null; then
                    echo -e "${YELLOW}⚠️  git-filter-repo not found${NC}"
                    echo -e "${YELLOW}   Install with: pip install git-filter-repo${NC}"
                    exit 1
                fi
                
                # Create filter expression
                echo "password==>REMOVED" > filter.txt
                echo "secret==>REMOVED" >> filter.txt
                echo "token==>REMOVED" >> filter.txt
                echo "api_key==>REMOVED" >> filter.txt
                echo "credential==>REMOVED" >> filter.txt
                
                # Run git-filter-repo
                git-filter-repo --replace-text filter.txt
                
                # Cleanup
                rm filter.txt
                
                echo -e "${GREEN}✅ git-filter-repo cleanup completed${NC}"
                ;;
            3)
                echo -e "${BLUE}🔧 Manual cleanup...${NC}"
                echo -e "${YELLOW}   This requires manual git rebase${NC}"
                echo -e "${YELLOW}   Consider using automated tools above${NC}"
                ;;
            *)
                echo -e "${RED}❌ Invalid choice${NC}"
                exit 1
                ;;
        esac
    else
        echo -e "${GREEN}✅ No secrets found in Git history${NC}"
    fi
}

# Function to remove sensitive files from history
remove_sensitive_files() {
    echo -e "${BLUE}🗑️  Removing sensitive files from history...${NC}"
    
    local sensitive_files=(
        ".env"
        ".env.production"
        ".env.staging"
        "secrets.txt"
        "credentials.json"
        "private.key"
        "id_rsa"
        "*.pem"
        "*.key"
        "config/secrets.json"
    )
    
    for file_pattern in "${sensitive_files[@]}"; do
        if git log --all --full-history -- "$file_pattern" --oneline 2>/dev/null | grep -q .; then
            echo -e "${YELLOW}⚠️  Removing $file_pattern from history${NC}"
            
            if command -v bfg > /dev/null; then
                bfg --delete-files "$file_pattern"
            else
                echo -e "${YELLOW}   Install BFG Repo-Cleaner for automated removal${NC}"
            fi
        fi
    done
}

# Function to force push cleaned history
push_cleaned_history() {
    echo -e "${BLUE}🚀 Pushing cleaned history...${NC}"
    
    echo -e "${YELLOW}⚠️  WARNING: This will rewrite history and force push${NC}"
    echo -e "${YELLOW}   Make sure all team members are aware${NC}"
    echo ""
    
    read -p "Continue with force push? (y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        git push origin --force --all
        git push origin --force --tags
        echo -e "${GREEN}✅ Force push completed${NC}"
    else
        echo -e "${YELLOW}⚠️  Force push cancelled${NC}"
        echo -e "${YELLOW}   You can push manually when ready${NC}"
    fi
}

# Main cleanup process
echo ""
echo -e "${BLUE}🔍 Starting Git history cleanup...${NC}"
echo ""

# Remove secrets from history
remove_secrets_from_history

echo ""

# Remove sensitive files
remove_sensitive_files

echo ""

# Garbage collection
echo -e "${BLUE}🧹 Running garbage collection...${NC}"
git gc --prune=now --aggressive

echo ""

# Final instructions
echo "========================================"
echo -e "${GREEN}✅ GIT HISTORY CLEANUP COMPLETED${NC}"
echo ""
echo -e "${BLUE}📋 NEXT STEPS:${NC}"
echo "1. Review the cleaned history"
echo "2. Test that everything works correctly"
echo "3. Force push to remote repository"
echo "4. Notify all team members about history rewrite"
echo "5. Update any cloned repositories"
echo ""
echo -e "${BLUE}🔄 BACKUP:${NC}"
echo -e "${GREEN}   Backup branch: $BACKUP_BRANCH${NC}"
echo -e "${YELLOW}   You can restore from this backup if needed${NC}"
echo ""
echo -e "${BLUE}🔐 SECURITY REMINDER:${NC}"
echo -e "${YELLOW}   Add sensitive files to .gitignore${NC}"
echo -e "${YELLOW}   Use environment variables for secrets${NC}"
echo -e "${YELLOW}   Set up pre-commit hooks to prevent future issues${NC}"