module.exports = {
  extends: ['@typescript-eslint/recommended'],
  plugins: ['security'],
  rules: {
    // 🛡️ AETHERIUS-PRIME SECURITY RULES
    
    // Prevent hardcoded secrets
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    
    // Custom rules for secret detection
    'no-hardcoded-secrets': 'error',
    'no-plain-text-passwords': 'error',
    'no-exposed-secrets': 'error',
    
    // Additional security rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
  },
  
  // Custom rule implementations
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'no-hardcoded-secrets': {
          meta: {
            type: 'problem',
            docs: {
              description: 'Disallow hardcoded secrets in source code'
            }
          },
          create(context) {
            const secretPatterns = [
              /sk-[a-zA-Z0-9]{48}/,  // OpenAI API keys
              /AIza[a-zA-Z0-9_-]{35}/,  // Google AI API keys
              /AKIA[0-9A-Z]{16}/,  // AWS Access Key IDs
              /ghp_[a-zA-Z0-9]{36}/,  // GitHub personal access tokens
              /password\s*=\s*['\"][^'\"]+['\"]/,
              /secret\s*=\s*['\"][^'\"]+['\"]/,
              /token\s*=\s*['\"][^'\"]+['\"]/,
              /api_key\s*=\s*['\"][^'\"]+['\"]/
            ];
            
            return {
              Literal(node) {
                if (typeof node.value === 'string') {
                  for (const pattern of secretPatterns) {
                    if (pattern.test(node.value)) {
                      context.report({
                        node,
                        message: 'Hardcoded secret detected. Use environment variables instead.'
                      });
                    }
                  }
                }
              }
            };
          }
        }
      }
    }
  ]
};