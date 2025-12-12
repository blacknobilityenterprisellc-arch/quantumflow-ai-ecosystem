# 🗄️ AETHERIUS-ETERNAL Database Setup Guide
## Unified Keystone Architecture - v17.0.1
### Neon PostgreSQL & Supabase Integration

---

## 📋 OVERVIEW

The unified-quantumflow-keystone AI ecosystem now features a **dual-database architecture** for maximum reliability and performance:

- **Primary Database**: Neon PostgreSQL (High-performance serverless PostgreSQL)
- **Backup Database**: Supabase PostgreSQL (Analytics & failover support)
- **ORM**: Prisma for type-safe database operations
- **Connection Pooling**: Optimized for serverless environments
- **SSL Encryption**: End-to-end encryption for all connections

---

## 🚀 QUICK SETUP

### 1. **Install Dependencies**
```bash
cd /home/z/unified-quantumflow-keystone
pnpm install
```

### 2. **Configure Environment Variables**
```bash
# Copy the database environment template
cp .env.database .env.local

# Edit with your actual database credentials
nano .env.local
```

### 3. **Setup Neon Database**
1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or use existing
3. Copy the connection string
4. Update `NEON_DATABASE_URL` in `.env.local`

### 4. **Setup Supabase Database**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Update `SUPABASE_DATABASE_URL` in `.env.local`

### 5. **Initialize Database**
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to databases
pnpm db:push

# Seed with initial data
pnpm db:seed

# Or run all at once
pnpm db:setup
```

---

## 🔧 DETAILED CONFIGURATION

### **Neon PostgreSQL Configuration**

```env
# Neon Connection String
NEON_DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Connection Pool Settings
NEON_POOL_SIZE="20"
NEON_POOL_TIMEOUT="30"
```

**Neon Features:**
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling
- ✅ Branching for development
- ✅ Built-in connection pooling
- ✅ 99.99% uptime SLA

### **Supabase Configuration**

```env
# Supabase Connection String
SUPABASE_DATABASE_URL="postgresql://postgres.xxx:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase API Keys
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Project Details
SUPABASE_PROJECT_ID="your-project-id"
SUPABASE_PROJECT_URL="https://your-project-id.supabase.co"
```

**Supabase Features:**
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ File storage
- ✅ Edge functions
- ✅ Auto-backups

---

## 📊 DATABASE SCHEMA

### **Core Tables**

#### **Users**
- Enhanced user management with roles and subscriptions
- API key management
- User preferences and metadata

#### **AI Models**
- 50+ AI models across 8 providers
- Performance tracking
- Cost analysis
- Capability mapping

#### **AI Conversations**
- Complete conversation history
- Token usage tracking
- Cost calculation
- Session management

#### **Content Management**
- Blog posts, documentation, tutorials
- SEO metadata
- Tagging system
- Publishing workflow

#### **Performance Analytics**
- Model performance metrics
- Response time tracking
- Error monitoring
- Usage statistics

#### **System Configuration**
- Dynamic configuration
- Feature flags
- Security settings
- Performance tuning

---

## 🛠️ DATABASE OPERATIONS

### **Development Commands**
```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Run migrations
pnpm db:migrate

# Reset database
pnpm db:reset

# Seed with sample data
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Complete setup
pnpm db:setup
```

### **Database Health Check**
```bash
# Check API health (includes database status)
curl https://unified-quantumflow-keystone.vercel.app/api/health

# Check detailed database statistics
curl https://unified-quantumflow-keystone.vercel.app/api/database/stats
```

---

## 🔒 SECURITY CONFIGURATION

### **Connection Security**
- ✅ SSL/TLS encryption enforced
- ✅ Connection string validation
- ✅ IP whitelisting support
- ✅ Query timeout protection

### **Data Protection**
- ✅ API key hashing
- ✅ Sensitive data encryption
- ✅ Audit logging
- ✅ Role-based access control

### **Backup Strategy**
- ✅ Automatic daily backups
- ✅ Point-in-time recovery
- ✅ Cross-region replication
- ✅ 30-day retention policy

---

## 📈 PERFORMANCE OPTIMIZATION

### **Connection Pooling**
```javascript
// Automatic connection pooling
const neonDb = new PrismaClient({
  datasources: {
    db: { url: process.env.NEON_DATABASE_URL }
  },
  // Connection pool settings
  __internal: {
    engine: {
      connectionLimit: 20,
      connectionTimeoutMillis: 30000
    }
  }
});
```

### **Query Optimization**
- ✅ Index optimization
- ✅ Query result caching
- ✅ Connection reuse
- ✅ Lazy loading

### **Monitoring**
- ✅ Real-time performance metrics
- ✅ Query analysis
- ✅ Error tracking
- ✅ Usage analytics

---

## 🚨 FAILOVER STRATEGY

### **Automatic Failover**
```javascript
// Built-in failover logic
export async function executeWithFailover(
  primaryOperation: () => Promise<T>,
  fallbackOperation?: () => Promise<T>
): Promise<T>
```

### **Failover Triggers**
- Connection timeout
- Database unavailable
- Query errors
- Performance degradation

### **Recovery Process**
- Automatic health checks
- Graceful failback
- Data synchronization
- Notification alerts

---

## 📋 ENVIRONMENT VARIABLES REFERENCE

### **Required Variables**
```env
NEON_DATABASE_URL="postgresql://..."
SUPABASE_DATABASE_URL="postgresql://..."
SUPABASE_PROJECT_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

### **Optional Variables**
```env
NEON_POOL_SIZE="20"
NEON_POOL_TIMEOUT="30"
DATABASE_POOL_SIZE="20"
DATABASE_POOL_TIMEOUT="30"
DATABASE_SSL_MODE="require"
PRISMA_GENERATE_DATAPROXY="true"
```

---

## 🔧 TROUBLESHOOTING

### **Common Issues**

#### **Connection Failed**
```bash
# Check connection string format
echo $NEON_DATABASE_URL

# Test connection
psql "$NEON_DATABASE_URL" -c "SELECT 1;"
```

#### **Migration Errors**
```bash
# Reset and retry
pnpm db:reset
pnpm db:push
pnpm db:seed
```

#### **Performance Issues**
```bash
# Check database stats
curl /api/database/stats

# Monitor queries
pnpm db:studio
```

### **Health Check Endpoints**
- **Overall Health**: `/api/health`
- **Database Stats**: `/api/database/stats`
- **API Status**: `/api/status`

---

## 🌟 DEPLOYMENT CONSIDERATIONS

### **Production Environment**
- ✅ Environment variables configured
- ✅ Connection pooling enabled
- ✅ SSL certificates valid
- ✅ Backup schedules set
- ✅ Monitoring configured

### **Security Checklist**
- ✅ Database credentials in environment variables
- ✅ No hardcoded connection strings
- ✅ API keys properly secured
- ✅ Access controls implemented
- ✅ Audit logging enabled

---

## 📞 SUPPORT

### **Database Issues**
1. Check health endpoints
2. Review environment variables
3. Verify connection strings
4. Check logs for errors

### **Performance Issues**
1. Monitor database stats
2. Check query performance
3. Review connection pooling
4. Analyze usage patterns

---

*Last Updated: 2025-12-12*
*Version: v17.0.1*
*Architecture: Keystone Unified*