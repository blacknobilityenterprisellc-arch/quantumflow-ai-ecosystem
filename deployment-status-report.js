#!/usr/bin/env node

/**
 * AETHERIUS-ETERNAL Global Deployment Status Report
 * Unified Keystone Architecture - v17.0.0
 * 
 * This script provides a comprehensive analysis of the deployment status
 * and generates actionable recommendations for completing the global launch.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 AETHERIUS-ETERNAL Global Deployment Status Report');
console.log('📋 Unified Keystone Architecture - v17.0.0');
console.log('=' .repeat(80));

// Check project structure
const projectRoot = process.cwd();
console.log(`\n📁 Project Root: ${projectRoot}`);

// Verify critical files
const criticalFiles = [
  'package.json',
  'vercel.json',
  'next.config.ts',
  '.env.production',
  'src/app/api/health/route.ts'
];

console.log('\n📋 Critical Files Status:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check build output
const buildDir = path.join(projectRoot, '.next');
const buildExists = fs.existsSync(buildDir);
console.log(`\n🔨 Build Status: ${buildExists ? '✅ Completed' : '❌ Not Built'}`);

if (buildExists) {
  const buildStats = fs.statSync(buildDir);
  console.log(`   📊 Build Size: ${(buildStats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📅 Last Modified: ${buildStats.mtime.toISOString()}`);
}

// Deployment Configuration Analysis
console.log('\n⚙️  Deployment Configuration Analysis:');

// Read vercel.json
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf8'));
  console.log('   ✅ vercel.json: Parsed Successfully');
  console.log(`   🌍 Regions: ${vercelConfig.regions ? vercelConfig.regions.join(', ') : 'Not specified'}`);
  console.log(`   🔧 Build Command: ${vercelConfig.buildCommand || 'Not specified'}`);
  console.log(`   📦 Output Directory: ${vercelConfig.outputDirectory || 'Not specified'}`);
} catch (error) {
  console.log('   ❌ vercel.json: Parse Error');
}

// Read package.json
try {
  const packageConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  console.log('   ✅ package.json: Parsed Successfully');
  console.log(`   📦 Project Name: ${packageConfig.name}`);
  console.log(`   🏷️  Version: ${packageConfig.version}`);
  console.log(`   📝 Description: ${packageConfig.description || 'Not specified'}`);
} catch (error) {
  console.log('   ❌ package.json: Parse Error');
}

// Environment Variables Check
console.log('\n🔐 Environment Variables Status:');
const envFile = path.join(projectRoot, '.env.production');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log(`   ✅ .env.production: Found (${envVars.length} variables)`);
  
  // Check critical environment variables
  const criticalEnvVars = [
    'NEXT_PUBLIC_APP_URL',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION',
    'DATABASE_URL'
  ];
  
  criticalEnvVars.forEach(varName => {
    const found = envContent.includes(`${varName}=`);
    console.log(`   ${found ? '✅' : '❌'} ${varName}`);
  });
} else {
  console.log('   ❌ .env.production: Not Found');
}

// API Endpoints Analysis
console.log('\n🔗 API Endpoints Analysis:');
const apiDir = path.join(projectRoot, 'src/app/api');
if (fs.existsSync(apiDir)) {
  const apiEndpoints = [];
  
  function findApiEndpoints(dir, basePath = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findApiEndpoints(fullPath, `${basePath}/${file}`);
      } else if (file === 'route.ts') {
        apiEndpoints.push(basePath || '/');
      }
    });
  }
  
  findApiEndpoints(apiDir);
  console.log(`   ✅ API Endpoints Found: ${apiEndpoints.length}`);
  apiEndpoints.forEach(endpoint => {
    console.log(`   📡 /api${endpoint}`);
  });
} else {
  console.log('   ❌ API Directory: Not Found');
}

// Generate Deployment Recommendations
console.log('\n🎯 Deployment Recommendations:');
console.log('   1. 🔐 Authenticate with Vercel CLI:');
console.log('      npx vercel login');
console.log('');
console.log('   2. 🔗 Link Project to Vercel:');
console.log('      npx vercel link --confirm');
console.log('');
console.log('   3. 🌍 Deploy to Global Network:');
console.log('      npx vercel --prod --yes');
console.log('');
console.log('   4. 📊 Verify Deployment:');
console.log('      curl https://unified-quantumflow-keystone.vercel.app/api/health');
console.log('');
console.log('   5. 🔧 Set Environment Variables in Vercel Dashboard:');
console.log('      - NEXTAUTH_SECRET');
console.log('      - DATABASE_URL');
console.log('      - AI Provider API Keys');

// Deployment Readiness Score
let readinessScore = 0;
const maxScore = 100;

if (fs.existsSync(path.join(projectRoot, 'package.json'))) readinessScore += 20;
if (fs.existsSync(path.join(projectRoot, 'vercel.json'))) readinessScore += 20;
if (fs.existsSync(path.join(projectRoot, '.env.production'))) readinessScore += 20;
if (fs.existsSync(buildDir)) readinessScore += 20;
if (fs.existsSync(path.join(projectRoot, 'src/app/api/health/route.ts'))) readinessScore += 20;

console.log('\n📊 Deployment Readiness Score:');
console.log(`   🎯 Score: ${readinessScore}/${maxScore} (${readinessScore}%)`);
console.log(`   📈 Status: ${readinessScore >= 80 ? '✅ Ready for Deployment' : readinessScore >= 60 ? '⚠️  Almost Ready' : '❌ Needs Work'}`);

console.log('\n🌟 AETHERIUS-ETERNAL Protocol: DEPLOYMENT ANALYSIS COMPLETE');
console.log('🚀 Next Step: Execute Vercel Authentication and Deployment');

// Generate deployment status JSON
const deploymentStatus = {
  timestamp: new Date().toISOString(),
  version: 'v17.0.0-unified-global',
  projectRoot,
  readinessScore,
  criticalFiles: criticalFiles.map(file => ({
    name: file,
    exists: fs.existsSync(path.join(projectRoot, file))
  })),
  buildStatus: {
    completed: buildExists,
    size: buildExists ? fs.statSync(buildDir).size : 0,
    lastModified: buildExists ? fs.statSync(buildDir).mtime.toISOString() : null
  },
  recommendations: [
    'Authenticate with Vercel CLI',
    'Link project to Vercel account',
    'Deploy to global network',
    'Set environment variables in Vercel dashboard',
    'Verify deployment health endpoint'
  ]
};

fs.writeFileSync(
  path.join(projectRoot, 'deployment-status-report.json'),
  JSON.stringify(deploymentStatus, null, 2)
);

console.log('\n📄 Detailed report saved to: deployment-status-report.json');