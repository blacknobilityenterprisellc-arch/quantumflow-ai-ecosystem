#!/bin/bash

# 🛡️ AETHERIUS-PRIME SECRET SCANNING SCRIPT
# Comprehensive secret detection and security analysis

set -e

echo "🔍 AETHERIUS-PRIME SECRET SCANNING PROTOCOLS ACTIVATED"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Secret patterns to detect
declare -a SECRET_PATTERNS=(
    "sk-[a-zA-Z0-9]{48}"  # OpenAI API keys
    "AIza[a-zA-Z0-9_-]{35}"  # Google AI API keys
    "AKIA[0-9A-Z]{16}"  # AWS Access Key IDs
    "[a-zA-Z0-9/+]{40}"  # Potential private keys
    "ghp_[a-zA-Z0-9]{36}"  # GitHub personal access tokens
    "xoxb-[0-9]{13}-[0-9]{13}"  # Slack bot tokens
    "glpat-[a-zA-Z0-9_-]{20}"  # GitLab personal access tokens
    "ya29\.[a-zA-Z0-9_-]{100,}"  # Google OAuth tokens
    "password\s*=\s*['\"][^'\"]+['\"]"  # Password assignments
    "secret\s*=\s*['\"][^'\"]+['\"]"  # Secret assignments
    "token\s*=\s*['\"][^'\"]+['\"]"  # Token assignments
    "api_key\s*=\s*['\"][^'\"]+['\"]"  # API key assignments
    "BEGIN\s+PRIVATE\s+KEY"  # Private key headers
    "BEGIN\s+RSA\s+PRIVATE\s+KEY"  # RSA private key headers
)

# File extensions to scan
declare -a SCAN_EXTENSIONS=(
    "js" "ts" "jsx" "tsx" "json" "yml" "yaml" "env" "config" "conf"
    "md" "txt" "py" "php" "rb" "go" "java" "c" "cpp" "h" "hpp"
)

# Directories to exclude
declare -a EXCLUDE_DIRS=(
    "node_modules" ".git" "dist" "build" "coverage" ".next" "out"
    "vendor" ".cache" "tmp" "temp" ".vscode" ".idea"
)

echo -e "${BLUE}📁 Scanning repository...${NC}"
echo ""

# Create results file
RESULTS_FILE="secret-scan-results-$(date +%Y%m%d-%H%M%S).txt"
echo "Secret Scan Results - $(date)" > "$RESULTS_FILE"
echo "======================================" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

SECRETS_FOUND=false

# Function to scan a single file
scan_file() {
    local file="$1"
    local pattern="$2"
    local pattern_name="$3"
    
    if grep -E "$pattern" "$file" > /dev/null 2>&1; then
        echo -e "${RED}🚨 SECRET DETECTED in $file${NC}"
        echo -e "${RED}   Pattern: $pattern_name${NC}"
        echo -e "${YELLOW}   Content: ${NC}"
        grep -n -E "$pattern" "$file" | head -3 | while read line; do
            echo -e "${YELLOW}     $line${NC}"
        done
        echo ""
        
        # Log to results file
        echo "SECRET DETECTED: $file" >> "$RESULTS_FILE"
        echo "Pattern: $pattern_name" >> "$RESULTS_FILE"
        grep -n -E "$pattern" "$file" >> "$RESULTS_FILE"
        echo "" >> "$RESULTS_FILE"
        
        SECRETS_FOUND=true
    fi
}

# Function to scan directory recursively
scan_directory() {
    local dir="$1"
    
    for ext in "${SCAN_EXTENSIONS[@]}"; do
        # Find files with current extension, excluding specified directories
        find "$dir" -name "*.$ext" -type f \
            $(printf -- '-not -path "*/%s/*" ' "${EXCLUDE_DIRS[@]}") \
            2>/dev/null | while read file; do
            
            # Skip if file is binary or very large
            if [ -f "$file" ] && [ ! -L "$file" ]; then
                file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
                if [ "$file_size" -lt 1048576 ]; then  # Less than 1MB
                    # Scan for each pattern
                    scan_file "$file" "sk-[a-zA-Z0-9]{48}" "OpenAI API Key"
                    scan_file "$file" "AIza[a-zA-Z0-9_-]{35}" "Google AI API Key"
                    scan_file "$file" "AKIA[0-9A-Z]{16}" "AWS Access Key ID"
                    scan_file "$file" "ghp_[a-zA-Z0-9]{36}" "GitHub Personal Access Token"
                    scan_file "$file" "xoxb-[0-9]{13}-[0-9]{13}" "Slack Bot Token"
                    scan_file "$file" "glpat-[a-zA-Z0-9_-]{20}" "GitLab Personal Access Token"
                    scan_file "$file" "ya29\.[a-zA-Z0-9_-]{100,}" "Google OAuth Token"
                    scan_file "$file" "password\s*=\s*['\"][^'\"]+['\"]" "Password Assignment"
                    scan_file "$file" "secret\s*=\s*['\"][^'\"]+['\"]" "Secret Assignment"
                    scan_file "$file" "token\s*=\s*['\"][^'\"]+['\"]" "Token Assignment"
                    scan_file "$file" "api_key\s*=\s*['\"][^'\"]+['\"]" "API Key Assignment"
                    scan_file "$file" "BEGIN\s+PRIVATE\s+KEY" "Private Key Header"
                    scan_file "$file" "BEGIN\s+RSA\s+PRIVATE\s+KEY" "RSA Private Key Header"
                fi
            fi
        done
    done
}

# Main scanning logic
echo -e "${BLUE}🔍 Starting comprehensive secret scan...${NC}"
echo ""

# Scan current directory
scan_directory "."

# Check for dangerous files
echo -e "${BLUE}📁 Checking for dangerous files...${NC}"
echo ""

DANGEROUS_FILES=(
    ".env" ".env.production" ".env.staging" "secrets.txt" "credentials.json"
    "private.key" "id_rsa" "id_rsa.pub" "config.json" "aws-credentials.json"
)

for dangerous_file in "${DANGEROUS_FILES[@]}"; do
    if [ -f "$dangerous_file" ]; then
        echo -e "${RED}🚨 DANGEROUS FILE FOUND: $dangerous_file${NC}"
        echo -e "${YELLOW}   This file should not be committed to version control${NC}"
        echo ""
        
        echo "DANGEROUS FILE: $dangerous_file" >> "$RESULTS_FILE"
        echo "This file should not be committed to version control" >> "$RESULTS_FILE"
        echo "" >> "$RESULTS_FILE"
        
        SECRETS_FOUND=true
    fi
done

# Check git history for secrets
if [ -d ".git" ]; then
    echo -e "${BLUE}📜 Scanning git history for secrets...${NC}"
    echo ""
    
    # Check for secrets in git history
    if git log --all --full-history -- "*password*" "*secret*" "*key*" "*token*" 2>/dev/null | grep -q "commit\|Author\|Date"; then
        echo -e "${YELLOW}⚠️  Potential secrets found in git history${NC}"
        echo -e "${YELLOW}   Consider using BFG Repo-Cleaner or git-filter-repo to remove them${NC}"
        echo ""
        
        echo "POTENTIAL SECRETS IN GIT HISTORY" >> "$RESULTS_FILE"
        echo "Consider using BFG Repo-Cleaner or git-filter-repo to remove them" >> "$RESULTS_FILE"
        echo "" >> "$RESULTS_FILE"
        
        SECRETS_FOUND=true
    fi
fi

# Final results
echo "======================================================"
if [ "$SECRETS_FOUND" = true ]; then
    echo -e "${RED}🚨 SECRETS DETECTED!${NC}"
    echo -e "${RED}   Please review and remediate all identified issues${NC}"
    echo -e "${YELLOW}   Detailed results saved to: $RESULTS_FILE${NC}"
    echo ""
    echo -e "${BLUE}📋 REMEDIATION STEPS:${NC}"
    echo "1. Remove all identified secrets from code"
    echo "2. Replace with environment variables"
    echo "3. Add files to .gitignore if needed"
    echo "4. Rotate any exposed secrets"
    echo "5. Clean git history if necessary"
    exit 1
else
    echo -e "${GREEN}✅ NO SECRETS DETECTED!${NC}"
    echo -e "${GREEN}   Repository appears to be secure${NC}"
    echo -e "${YELLOW}   Results saved to: $RESULTS_FILE${NC}"
    exit 0
fi