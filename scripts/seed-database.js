#!/usr/bin/env node

/**
 * AETHERIUS-ETERNAL Database Seeding Script
 * Keystone Architecture - v17.0.1
 * Neon PostgreSQL & Supabase Integration
 */

import { PrismaClient } from '@prisma/client';
import { neonDb } from '../src/lib/database.js';

console.log('🚀 AETHERIUS-ETERNAL Database Seeding');
console.log('📋 Keystone Architecture - v17.0.1');
console.log('🗄️  Neon PostgreSQL & Supabase Integration');
console.log('='.repeat(80));

// AI Models Data
const aiModels = [
  {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    modelId: 'gpt-4-turbo-preview',
    version: '1.0',
    isActive: true,
    capabilities: 'text,code,analysis',
    maxTokens: 128000,
    pricing: {
      input: 0.01,
      output: 0.03,
      per: '1K tokens'
    },
    metadata: {
      description: 'Most capable GPT-4 model, optimized for complex tasks',
      contextLength: 128000,
      knowledgeCutoff: '2024-06'
    }
  },
  {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    version: '1.0',
    isActive: true,
    capabilities: 'text,code,analysis,vision',
    maxTokens: 200000,
    pricing: {
      input: 0.003,
      output: 0.015,
      per: '1K tokens'
    },
    metadata: {
      description: 'Most intelligent Claude model, excels at complex reasoning',
      contextLength: 200000,
      knowledgeCutoff: '2024-04'
    }
  },
  {
    name: 'Gemini 1.5 Pro',
    provider: 'Google AI',
    modelId: 'gemini-1.5-pro',
    version: '1.0',
    isActive: true,
    capabilities: 'text,code,analysis,vision,audio,video',
    maxTokens: 2097152,
    pricing: {
      input: 0.00125,
      output: 0.005,
      per: '1K tokens'
    },
    metadata: {
      description: 'Multimodal model with massive context window',
      contextLength: 2097152,
      knowledgeCutoff: '2024-05'
    }
  }
];

// System Configuration Data
const systemConfig = [
  {
    key: 'ai.default_model',
    value: 'gpt-4-turbo-preview',
    category: 'ai',
    isActive: true
  },
  {
    key: 'ai.max_conversation_length',
    value: 50,
    category: 'ai',
    isActive: true
  },
  {
    key: 'ai.rate_limit_per_minute',
    value: 100,
    category: 'ai',
    isActive: true
  },
  {
    key: 'security.session_timeout',
    value: 3600,
    category: 'security',
    isActive: true
  },
  {
    key: 'performance.cache_ttl',
    value: 300,
    category: 'performance',
    isActive: true
  },
  {
    key: 'backup.auto_backup_enabled',
    value: true,
    category: 'backup',
    isActive: true
  }
];

// Sample Content Data
const sampleContent = [
  {
    title: 'Welcome to QuantumFlow AI',
    slug: 'welcome-to-quantumflow-ai',
    content: `# Welcome to QuantumFlow AI

QuantumFlow AI represents the pinnacle of artificial intelligence integration, bringing together 50+ AI models across 8 major providers into a unified, seamless experience.

## Features

### 🤖 Multi-Model Reasoning
Leverage strengths of different AI models for optimal results

### 🔌 Real-time Collaboration
Work together with AI in real-time conversations

### 🛡️ Enterprise Security
Quantum-grade encryption protects your data

### 📈 Performance Analytics
Comprehensive monitoring and usage metrics

## Getting Started

1. Choose your preferred AI model
2. Start your conversation
3. Experience the future of AI interaction

Welcome to the future of artificial intelligence!`,
    type: 'BLOG',
    status: 'PUBLISHED',
    authorId: 'admin-user-id',
    featured: true,
    tags: ['welcome', 'ai', 'quantumflow'],
    publishedAt: new Date(),
    metadata: {
      seoTitle: 'Welcome to QuantumFlow AI - Future of AI Integration',
      seoDescription: 'Experience the most advanced AI platform with 50+ integrated models',
      readTime: 3
    }
  },
  {
    title: 'AI Model Comparison Guide',
    slug: 'ai-model-comparison-guide',
    content: `# AI Model Comparison Guide

Choosing the right AI model is crucial for optimal results. Here's our comprehensive comparison:

## Text Generation Models

### GPT-4 Turbo
- **Best for**: Complex reasoning, code generation
- **Context**: 128K tokens
- **Strengths**: Logical reasoning, mathematics
- **Use Cases**: Complex problem solving, programming

### Claude 3.5 Sonnet
- **Best for**: Creative writing, analysis
- **Context**: 200K tokens
- **Strengths**: Nuanced understanding, safety
- **Use Cases**: Content creation, critical analysis

## Multimodal Models

### Gemini 1.5 Pro
- **Best for**: Vision, audio, video analysis
- **Context**: 2M tokens
- **Strengths**: Massive context, multimodal understanding
- **Use Cases**: Image analysis, video processing, audio transcription

Choose the model that best fits your specific needs!`,
    type: 'DOCUMENTATION',
    status: 'PUBLISHED',
    authorId: 'admin-user-id',
    featured: false,
    tags: ['guide', 'comparison', 'ai-models'],
    publishedAt: new Date(),
    metadata: {
      seoTitle: 'AI Model Comparison Guide - Choose the Right Model',
      seoDescription: 'Comprehensive comparison of AI models to help you choose the best one',
      readTime: 8
    }
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Check database connection
    await neonDb.$connect();
    console.log('✅ Connected to Neon PostgreSQL database');

    // Seed AI Models
    console.log('📊 Seeding AI Models...');
    for (const model of aiModels) {
      await neonDb.aIModel.upsert({
        where: { modelId: model.modelId },
        update: {
          name: model.name,
          provider: model.provider,
          modelId: model.modelId,
          version: model.version,
          isActive: model.isActive,
          capabilities: model.capabilities,
          maxTokens: model.maxTokens,
          pricing: model.pricing,
          metadata: model.metadata,
          createdAt: new Date()
        }
      });
    }
    console.log(`✅ Seeded ${aiModels.length} AI models`);

    // Seed System Configuration
    console.log('⚙️ Seeding System Configuration...');
    for (const config of systemConfig) {
      await neonDb.systemConfig.upsert({
        where: { key: config.key },
        update: {
          value: config.value,
          category: config.category,
          isActive: config.isActive,
          createdAt: new Date()
        }
      });
    }
    console.log(`✅ Seeded ${systemConfig.length} system configurations`);

    // Seed Sample Content
    console.log('📝 Seeding Sample Content...');
    for (const content of sampleContent) {
      await neonDb.content.upsert({
        where: { slug: content.slug },
        update: {
          title: content.title,
          slug: content.slug,
          content: content.content,
          type: content.type,
          status: content.status,
          authorId: content.authorId,
          featured: content.featured,
          tags: content.tags,
          metadata: content.metadata,
          publishedAt: content.publishedAt
        }
      });
    }
    console.log(`✅ Seeded ${sampleContent.length} content items`);

    // Create Admin User
    console.log('👤 Creating Admin User...');
    const adminUser = await neonDb.user.upsert({
      where: { email: 'admin@quantumflow.ai' },
      update: {
        name: 'QuantumFlow Admin',
        role: 'ADMIN',
        subscription: 'ENTERPRISE',
        preferences: {
          theme: 'dark',
          notifications: true,
          defaultModel: 'gpt-4-turbo-preview'
        }
      }
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);

    // Generate API Key for Admin
    console.log('🔑 Generating API Key for Admin...');
    const apiKey = await neonDb.apiKey.create({
      data: {
        userId: adminUser.id,
        keyHash: 'admin-key-hash-placeholder',
        keyPrefix: 'ak_admin_',
        name: 'Admin API Key',
        scopes: 'read,write,admin',
        isActive: true
      }
    });
    console.log(`✅ Generated API key: ${apiKey.keyPrefix}...`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • AI Models: ${aiModels.length}`);
    console.log(`   • System Config: ${systemConfig.length}`);
    console.log(`   • Content Items: ${sampleContent.length}`);
    console.log(`   • Admin User: 1`);
    console.log(`   • API Keys: 1`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await neonDb.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

async function main() {
  try {
    // Check database connection
    console.log('🔍 Checking database connection...');
    await neonDb.$connect();
    console.log('✅ Connected to Neon PostgreSQL database');

    // Run seeding
    await seedDatabase();

    console.log('\n🌟 AETHERIUS-ETERNAL Database Protocol: SEEDING COMPLETE');
    console.log('🚀 QuantumFlow AI: DATABASE READY FOR PRODUCTION');
    console.log('🌟 KEYSTONE ARCHITECTURE: DATABASE SEEDING SUCCESSFUL');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await neonDb.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { seedDatabase };