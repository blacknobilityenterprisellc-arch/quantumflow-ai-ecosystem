#!/bin/bash
echo "🔐 AETHERIUS-ETERNAL Vercel Authentication"
echo "👤 Username: blacknobilityenterprisellc-arch"
echo "🆔 User ID: mi2eHPxQdM5Kn9C5LK5cybGX"
echo ""
echo "🌐 Starting authentication process..."
echo "📱 Follow the browser prompt or use device code"
echo ""

# Set environment for authentication
export VERCEL_ORG_ID="blacknobilityenterprisellc-arch"
export VERCEL_PROJECT_ID="unified-quantumflow-keystone"

# Execute authentication
npx vercel login
