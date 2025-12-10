#!/usr/bin/env bash
clear
echo "====================================================================="
echo "   QUANTUMFLOW AI ECOSYSTEM – SECURITY & INTEGRITY AUDIT SUITE v1   "
echo "====================================================================="
echo ""

# -------- PREP --------
echo "[1] Initializing environment..."
if ! command -v node &> /dev/null
then
    echo "ERROR: Node.js is not installed. Install Node.js 18+ and rerun."
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "ERROR: npm is not installed. Install npm and rerun."
    exit
fi

echo "[OK] Node detected: $(node -v)"
echo "[OK] npm detected: $(npm -v)"
echo ""

# -------- INSTALL AUDIT TOOLS --------
echo "[2] Installing audit dependencies locally..."
npm install --silent eslint depcheck retire --save-dev
echo "[OK] Audit tools installed."
echo ""

# -------- REPORT DIRECTORY --------
mkdir -p audit_reports
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
report_dir="audit_reports/audit_$timestamp"
mkdir -p "$report_dir"

echo "[3] Report directory created: $report_dir"
echo ""

# -------- NPM AUDIT --------
echo "[4] Running npm security audit..."
npm audit --json > "$report_dir/npm_security.json"
echo "[OK] npm security results saved."
echo ""

# -------- OUTDATED PACKAGES --------
echo "[5] Checking outdated dependencies..."
npm outdated --json > "$report_dir/outdated_dependencies.json"
echo "[OK] Dependency health report saved."
echo ""

# -------- SECRET SCAN --------
echo "[6] Scanning project for exposed secrets..."
grep -RHi --exclude-dir="node_modules" -E "(API_KEY|SECRET|PASSWORD|TOKEN|AUTH)" . \
    > "$report_dir/secrets_scan.txt"
echo "[OK] Secret exposure report saved."
echo ""

# -------- FILE TREE --------
echo "[7] Generating file structure report..."
tree -a -I "node_modules|.git" > "$report_dir/file_tree.txt"
echo "[OK] File structure saved."
echo ""

# -------- LINT --------
echo "[8] Running ESLint analysis..."
npx eslint . --ext .js,.ts,.tsx --format json \
    > "$report_dir/eslint_report.json"
echo "[OK] ESLint report saved."
echo ""

# -------- DEPCHECK --------
echo "[9] Checking unused/missing dependencies..."
npx depcheck > "$report_dir/depcheck_report.txt"
echo "[OK] Dependency usage report saved."
echo ""

# -------- RETIRE (SECURITY SCAN) --------
echo "[10] Running Retire.js vulnerability scan..."
npx retire --outputformat json --outputpath "$report_dir/retire_security.json"
echo "[OK] Retire.js vulnerability report saved."
echo ""

# -------- INVENTORY OF AI SERVICES --------
echo "[11] Indexing AI service modules..."
grep -RHi --exclude-dir="node_modules" -E "export|function|class" ./src \
    | grep -Ei "(ai|service|agent|flow)" \
    > "$report_dir/ai_services_inventory.txt"
echo "[OK] AI services inventory saved."
echo ""

# -------- CONFIG FILE REPORT --------
echo "[12] Collecting configuration files..."
find . -maxdepth 3 -type f \( -name "*.config.js" -o -name "*.env" -o -name "*.json" \) \
    > "$report_dir/config_files.txt"
echo "[OK] Config file list saved."
echo ""

echo ""
echo "====================================================================="
echo "            AUDIT COMPLETED – REPORTS GENERATED SUCCESSFULLY         "
echo "====================================================================="
echo "Your audit folder:"
echo "   → $report_dir"
echo ""
echo "Review the following key files first:"
echo "   - npm_security.json"
echo "   - outdated_dependencies.json"
echo "   - secrets_scan.txt"
echo "   - ai_services_inventory.txt"
echo "   - retire_security.json"
echo ""
echo "====================================================================="