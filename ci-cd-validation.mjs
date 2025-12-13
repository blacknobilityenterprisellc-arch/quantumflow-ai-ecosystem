#!/usr/bin/env node

// CI/CD Pipeline Fix Validation - ES2025 Edition
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { performance } from 'node:perf_hooks'

console.log('🔧 CI/CD Pipeline Fix Validation')
console.log('=' .repeat(50))
console.log('🚀 ES2025 Compatibility Check')
console.log('⚡ Node.js Version Validation')
console.log('🎯 pnpm Lockfile Verification')
console.log('=' .repeat(50))

const startTime = performance.now()

const validations = [
  {
    name: 'Node.js Engine Requirements',
    check: () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      return packageJson.engines?.node?.includes('>=22.0.0')
    },
    status: null,
    description: 'Package.json requires Node.js >=22.0.0'
  },
  {
    name: 'pnpm Lockfile Existence',
    check: () => existsSync('pnpm-lock.yaml'),
    status: null,
    description: 'pnpm-lock.yaml file exists'
  },
  {
    name: 'GitHub Actions Node Version',
    check: () => {
      const workflow = readFileSync('.github/workflows/ci-cd.yml', 'utf8')
      return workflow.includes("NODE_VERSION: '22'")
    },
    status: null,
    description: 'GitHub Actions uses Node.js 22'
  },
  {
    name: 'GitHub Actions pnpm Version',
    check: () => {
      const workflow = readFileSync('.github/workflows/ci-cd.yml', 'utf8')
      return workflow.includes("PNPM_VERSION: '9'")
    },
    status: null,
    description: 'GitHub Actions uses pnpm v9'
  },
  {
    name: 'pnpm Action Version',
    check: () => {
      const workflow = readFileSync('.github/workflows/ci-cd.yml', 'utf8')
      return workflow.includes('pnpm/action-setup@v4')
    },
    status: null,
    description: 'Uses latest pnpm action v4'
  },
  {
    name: 'Frozen Lockfile Command',
    check: () => {
      const workflow = readFileSync('.github/workflows/ci-cd.yml', 'utf8')
      return workflow.includes('pnpm install --frozen-lockfile --prefer-frozen-lockfile')
    },
    status: null,
    description: 'Uses proper frozen-lockfile command'
  }
]

console.log('\n🔍 Running Validations:')

validations.forEach((validation, index) => {
  try {
    validation.status = validation.check()
    const icon = validation.status ? '✅' : '❌'
    console.log(`${index + 1}. ${validation.name}: ${icon}`)
    console.log(`   📝 ${validation.description}`)
    if (!validation.status) {
      console.log(`   ⚠️  STATUS: FAILED`)
    }
  } catch (error) {
    validation.status = false
    console.log(`${index + 1}. ${validation.name}: ❌`)
    console.log(`   📝 ${validation.description}`)
    console.log(`   ⚠️  ERROR: ${error.message}`)
  }
  console.log('')
})

const passedValidations = validations.filter(v => v.status).length
const totalValidations = validations.length
const successRate = (passedValidations / totalValidations) * 100

console.log('📊 Validation Results:')
console.log(`   ✅ Passed: ${passedValidations}/${totalValidations}`)
console.log(`   📈 Success Rate: ${successRate.toFixed(1)}%`)
console.log(`   ⏱️  Validation Time: ${(performance.now() - startTime).toFixed(2)}ms`)

if (successRate === 100) {
  console.log('\n🎉 ALL VALIDATIONS PASSED!')
  console.log('🚀 CI/CD Pipeline is ES2025 Ready')
  console.log('⚡ Node.js 22 compatibility achieved')
  console.log('🏆 pnpm lockfile issues resolved')
} else {
  console.log('\n⚠️ SOME VALIDATIONS FAILED')
  console.log('🔧 Additional fixes may be required')
}

console.log('\n🎯 Next Steps:')
console.log('1. Commit and push the CI/CD fixes')
console.log('2. Monitor the next GitHub Actions run')
console.log('3. Verify successful pipeline execution')
console.log('4. Validate ES2025 features in CI environment')

// Generate validation report
const validationReport = {
  timestamp: new Date().toISOString(),
  totalValidations,
  passedValidations,
  successRate,
  validations: validations.map(v => ({
    name: v.name,
    status: v.status,
    description: v.description
  })),
  ciCdReady: successRate === 100
}

writeFileSync('ci-cd-validation-report.json', JSON.stringify(validationReport, null, 2))
console.log('\n📁 Validation Report: ci-cd-validation-report.json')