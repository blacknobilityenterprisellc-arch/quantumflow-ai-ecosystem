/**
 * AETHERIUS-ETERNAL Database Export
 * Keystone Architecture - v17.0.1
 * Unified Neon PostgreSQL & Supabase Integration
 */

// Import the unified database module
import {
  neonDb as db,
  supabase,
  checkDatabaseHealth,
  executeWithFailover,
  trackModelPerformance,
  createConversation,
  updateConversation,
  createUserWithPreferences,
  generateApiKey,
  createContent,
  getSystemConfig,
  logAuditEvent,
  getDatabaseStats,
  shutdownDatabase,
  initializeDatabase
} from './database';

// Export the main database client (Neon PostgreSQL)
export { db };

// Export Supabase client for backup/operations
export { supabase };

// Export database utilities
export {
  checkDatabaseHealth,
  executeWithFailover,
  trackModelPerformance,
  createConversation,
  updateConversation,
  createUserWithPreferences,
  generateApiKey,
  createContent,
  getSystemConfig,
  logAuditEvent,
  getDatabaseStats,
  shutdownDatabase,
  initializeDatabase
};

// Export types for better TypeScript support
export type {
  User,
  AIModel,
  AIConversation,
  ApiKey,
  Content,
  ModelPerformance,
  SystemConfig,
  AuditLog
} from '@prisma/client';

// Default export for backward compatibility
export default db;