# Supabase Database - File Index

Quick navigation guide for all database-related files.

## 📂 Directory Structure

```
supabase/
├── migrations/                    # Database migration files
│   ├── 00001_create_core_schema.sql
│   └── 00002_create_inventory_schema.sql
├── seed.sql                       # Sample/test data
├── maintenance.sql                # Maintenance tasks
├── rollback.sql                   # Rollback procedure
├── README.md                      # Main documentation
├── DEPLOYMENT.md                  # Deployment guide
├── QUICK_REFERENCE.md             # Quick queries reference
├── CONNECTION_POOLING.md          # Pooling configuration
└── INDEX.md                       # This file
```

## 🚀 Start Here

**New to this database?** → [README.md](./README.md)

**Ready to deploy?** → [DEPLOYMENT.md](./DEPLOYMENT.md)

**Need a quick query?** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

## 📁 File Descriptions

### Migration Files

#### [00001_create_core_schema.sql](./migrations/00001_create_core_schema.sql)
**Size:** 23KB | **Tables:** 6 | **Functions:** 5

Creates the core platform foundation:
- Organizations (multi-tenant)
- Users with roles
- Module subscription system
- User invitations
- Audit logging
- RLS policies for security

**Key Features:**
- Multi-tenant isolation
- Role-based access (super_admin, org_admin, manager, user, viewer)
- Module dependency checking
- Automatic invitation expiry

#### [00002_create_inventory_schema.sql](./migrations/00002_create_inventory_schema.sql)
**Size:** 46KB | **Tables:** 15 | **Functions:** 7

Complete inventory management system:
- Product catalog with variants
- Multi-warehouse support
- Stock tracking and movements
- Purchase orders
- Suppliers
- Stock adjustments
- Transfer management
- Low stock alerts

**Key Features:**
- Automatic stock movement logging
- Stock reservation system
- Hierarchical categories
- Unit conversions
- Comprehensive RLS

### Data Files

#### [seed.sql](./seed.sql)
**Size:** 26KB | **Type:** Development Data

Sample data for testing and development:
- 2 demo organizations
- 8 system modules (inventory, CRM, recruitment, etc.)
- 6 sample products with variants
- 3 warehouses with stock
- Suppliers and purchase orders
- Stock movements and alerts

**⚠️ Warning:** Only run in development/staging environments!

### Maintenance Files

#### [maintenance.sql](./maintenance.sql)
**Size:** 10KB | **Type:** Operations

Routine maintenance tasks:
- Database vacuum and analyze
- Index rebuilding
- Expire old invitations
- Check low stock
- Clean up old audit logs
- Health checks
- Performance statistics
- Business metrics

**Run:** Weekly or as needed

#### [rollback.sql](./rollback.sql)
**Size:** 7.3KB | **Type:** Emergency Recovery

Complete database rollback:
- Drops all schemas
- Removes all tables
- Cleans up functions
- Includes 5-second safety pause

**⚠️ DANGER:** Only use when you need to completely reset the database!

### Documentation Files

#### [README.md](./README.md)
**Size:** 11KB | **Type:** Primary Documentation

Complete schema documentation:
- Schema overview
- Quick start guide
- Security & RLS policies
- Useful functions
- Monitoring queries
- Troubleshooting

**Best for:** Understanding the entire system

#### [DEPLOYMENT.md](./DEPLOYMENT.md)
**Size:** 9.7KB | **Type:** Step-by-Step Guide

Production deployment guide:
- Prerequisites checklist
- 10-step deployment process
- Verification queries
- Post-deployment checklist
- Monitoring setup
- Backup strategy
- Rollback procedures

**Best for:** First-time deployment

#### [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**Size:** 11KB | **Type:** Query Cookbook

Fast reference for developers:
- Common SQL queries
- CRUD operations
- Reporting queries
- Security checks
- Troubleshooting queries

**Best for:** Daily development work

#### [CONNECTION_POOLING.md](./CONNECTION_POOLING.md)
**Size:** 11KB | **Type:** Performance Guide

Database connection optimization:
- Supabase PgBouncer setup
- Next.js configuration
- Connection pool sizing
- Performance best practices
- Monitoring connection health
- Scaling strategies

**Best for:** Production optimization

## 🎯 Common Tasks

### First Time Setup

1. Read [README.md](./README.md) for overview
2. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) step-by-step
3. Configure [CONNECTION_POOLING.md](./CONNECTION_POOLING.md)
4. Bookmark [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Daily Development

- Need a query? → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- Something broken? → [README.md](./README.md#troubleshooting)
- Need to check stock? → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#inventory-queries)

### Weekly Operations

- Run [maintenance.sql](./maintenance.sql)
- Check monitoring dashboards
- Review audit logs
- Verify backups

### Emergency Procedures

1. Check [README.md](./README.md#troubleshooting)
2. Review recent migrations
3. Check [maintenance.sql](./maintenance.sql) health checks
4. Last resort: [rollback.sql](./rollback.sql) + restore backup

## 📊 Schema Statistics

### Core Schema (`core`)
- **Tables:** 6
- **Functions:** 5
- **Indexes:** 15+
- **RLS Policies:** 20+

### Inventory Schema (`inventory`)
- **Tables:** 15
- **Functions:** 7
- **Indexes:** 40+
- **RLS Policies:** 30+

### Total Database
- **Schemas:** 2 (+ auth from Supabase)
- **Tables:** 21
- **Functions:** 12
- **Triggers:** 16
- **Indexes:** 55+
- **RLS Policies:** 50+

## 🔗 External Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/sjbvvrjxsbqrgtpgdxwr)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [PgBouncer Docs](https://www.pgbouncer.org/)

## 📞 Support

### Getting Help

1. **Schema questions** → [README.md](./README.md)
2. **Query examples** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
3. **Deployment issues** → [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Performance** → [CONNECTION_POOLING.md](./CONNECTION_POOLING.md)

### Common Questions

**Q: How do I deploy the database?**
A: Follow [DEPLOYMENT.md](./DEPLOYMENT.md) step by step.

**Q: How do I add a new product?**
A: See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#add-product)

**Q: How do I adjust stock?**
A: Use the `inventory.adjust_stock()` function. See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#adjust-stock)

**Q: Why can't users see data?**
A: Check RLS policies. See [README.md](./README.md#troubleshooting)

**Q: How do I backup the database?**
A: See [DEPLOYMENT.md](./DEPLOYMENT.md#backup-strategy)

## 🔄 Version History

| Version | Date | Migration | Description |
|---------|------|-----------|-------------|
| 1.0.0 | 2025-10-20 | 00001 | Core schema |
| 1.0.0 | 2025-10-20 | 00002 | Inventory schema |

## 📝 Notes

- Always test migrations in development first
- RLS is enabled on ALL tables
- Use connection pooling (port 6543) in production
- Run maintenance tasks weekly
- Keep backups up to date
- Monitor slow queries
- Review security regularly

## ✅ Quick Checklist

Before going to production:

- [ ] Read all documentation
- [ ] Test migrations locally
- [ ] Verify RLS policies
- [ ] Set up connection pooling
- [ ] Configure monitoring
- [ ] Set up automated backups
- [ ] Test disaster recovery
- [ ] Document custom procedures
- [ ] Train team on operations
- [ ] Set up alerting

---

**Project:** Horizon Systems
**Database:** PostgreSQL 15 (Supabase)
**Project ID:** sjbvvrjxsbqrgtpgdxwr
**Last Updated:** 2025-10-20
