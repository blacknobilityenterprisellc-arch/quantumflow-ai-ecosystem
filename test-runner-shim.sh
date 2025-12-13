#!/bin/bash

# Test Runner Shim for QuantumFlow AI Ecosystem
# This script uses the Node.js test-runner.js

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_PATH="${NODE_PATH:-/usr/local/bin:/usr/bin:/bin}"
export PATH="$SCRIPT_DIR/node_modules/.bin:$PATH"

# Run the actual test runner
exec node "$SCRIPT_DIR/test-runner.js" "$@"