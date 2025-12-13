#!/usr/bin/env node

/**
 * Test Runner for QuantumFlow AI Ecosystem
 * Runs tests with 100% coverage requirement
 */

import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL(import.meta.url))

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  magenta: '\x1b[35m',
}

function log(message, color = 'white') {
  console.log(`${color}[QuantumFlow Test Runner]${colors.reset} ${message}`)
}

function success(message) {
  log(message, colors.green)
}

function error(message) {
  log(message, colors.red)
}

function warning(message) {
  log(message, colors.yellow)
}

function info(message) {
  log(message, colors.cyan)
}

// Test configuration
const TEST_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  coverageThreshold: 100,
  verbose: process.argv.includes('--verbose'),
  watch: process.argv.includes('--watch'),
  coverage: process.argv.includes('--coverage'),
}

// Test files to run
const TEST_PATTERNS = [
  'src/**/*.test.{ts,tsx}',
  'src/**/*.spec.{ts,tsx}',
]

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0] || 'test'

async function runTests() {
  info('🚀 Starting QuantumFlow Test Suite')
  info(`Command: ${command}`)
  info(`Patterns: ${TEST_PATTERNS.join(', ')}`)
  info(`Coverage: ${TEST_CONFIG.coverage ? 'Enabled' : 'Disabled'}`)
  info(`Watch Mode: ${TEST_CONFIG.watch ? 'Enabled' : 'Disabled'}`)
  info(`Timeout: ${TEST_CONFIG.timeout}ms`)
  info(`Coverage Threshold: ${TEST_CONFIG.coverageThreshold}%`)
  
  const jestPath = join(__dirname, 'node_modules', '.bin', 'jest')
  const testArgs = [
    ...TEST_PATTERNS,
    ...(TEST_CONFIG.verbose ? ['--verbose'] : []),
    ...(TEST_CONFIG.watch ? ['--watch'] : []),
    ...(TEST_CONFIG.coverage ? ['--coverage', '--coverageReporters=text', '--coverageReporters=text-summary'] : []),
    ...(TEST_CONFIG.coverage ? ['--passWithNoTests'] : []),
    ...(TEST_CONFIG.coverage ? ['--coverageThreshold=100'] : []),
  '--maxWorkers=4',
    '--detectOpenHandles',
    '--forceExit',
  '--testTimeoutMS', TEST_CONFIG.timeout.toString(),
  ]

  if (command === 'watch') {
    testArgs.push('--watchAll')
  }

  if (command === 'coverage') {
    testArgs.push('--coverage', '--coverageReporters=text', '--coverageReporters=text-summary')
  }

  return new Promise((resolve, reject) => {
    const child = spawn(jestPath, testArgs, {
      stdio: 'inherit',
      cwd: __dirname,
      env: {
        ...process.env,
        NODE_ENV: 'test',
        CI: process.env.CI || 'true',
      NODE_OPTIONS: '--experimental-vm-modules',
      TZ: 'UTC',
      LC_ALL: 'C.UTF-8',
        LANG: 'en_US.UTF-8',
      LANGUAGE: 'en_US:en',
      LC_CTYPE: 'en_US.UTF-8',
      JEST_JUNIT_TIMEOUT: TEST_CONFIG.timeout.toString(),
        JEST_STANDAL_TIMEOUT: TEST_CONFIG.timeout.toString(),
      },
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (data) => {
      stdout += data
    })

    child.stderr?.on('data', (data) => {
      stderr += data
    })

    child.on('close', (code) => {
      if (code === 0) {
        success('✅ Tests completed successfully!')
        if (TEST_CONFIG.coverage && stdout.includes('All files')) {
          const coverageMatch = stdout.match(/All files\s+\|\s+(\d+\.\d+)%\s+\s+covered/g)
          if (coverageMatch) {
            const coverage = coverageMatch[1]
            success(`📊 Coverage: ${coverage}%`)
          }
        }
        resolve(0)
      } else {
        error(`❌ Tests failed with exit code ${code}`)
        if (stderr) {
          error('Error output:')
          error(stderr)
        }
        reject(new Error(`Tests failed with exit code ${code}`))
      }
    })

    child.on('error', (err) => {
      error(`❌ Test process error: ${err.message}`)
      reject(err)
    })
  })
  })
}

async function checkDependencies() {
  info('🔍 Checking dependencies...')
  
  const packageJsonPath = join(__dirname, 'package.json')
  const packageJson = require(packageJsonPath)
  
  const requiredDeps = [
    'vitest',
    '@testing-library/jest-dom',
    '@testing-library/react',
    '@testing-library/user-event',
    '@testing-library/jest-dom',
  ]
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.devDependencies[dep])
  
  if (missingDeps.length > 0) {
    warning('⚠ Missing test dependencies:')
    missingDeps.forEach(dep => {
      warning(`  - ${dep}`)
    })
    info('Run: npm install --save-dev ' + missingDeps.join(' '))
    return false
  }
  
  success('✅ All test dependencies are installed')
  return true
}

async function main() {
  try {
    // Check dependencies first
    const depsOk = await checkDependencies()
    if (!depsOk) {
      process.exit(1)
    }

    // Run tests
    await runTests()
  } catch (error) {
    error('💥 Test runner error:', error.message)
    process.exit(1)
  }
}

// Handle process termination
process.on('SIGINT', () => {
  info('\n🛑 Test runner interrupted by user')
  process.exit(0)
})

process.on('SIGTERM', () => {
  info('\n🛑 Test runner terminated')
  process.exit(0)
})

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}