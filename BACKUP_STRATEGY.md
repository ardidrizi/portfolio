# Database & Backup Strategy

## Automated Backups

### For Railway PostgreSQL

Railway provides **automatic daily backups** retained for 7 days by default.

To enable extended backups:

1. Go to Railway dashboard → Your PostgreSQL plugin
2. Settings → Enable "Backup Snapshots"
3. Schedule: Daily at 2 AM UTC

### For Local SQLite (Development)

Git tracks `dev.db` for version control during development.

```bash
# Manual backup before major changes
cp back-end/dev.db back-end/dev.db.backup.$(date +%Y%m%d)

# Restore if needed
cp back-end/dev.db.backup.20240207 back-end/dev.db
```

## Production Data Safety

### Database Selection

- **Local Dev**: SQLite (simple, file-based)
- **Production**: PostgreSQL (robust, scalable, backed by Railway)

### Migration Strategy

```bash
# Before deploying to production:
# 1. Create PostgreSQL database on Railway
# 2. Update DATABASE_URL in Railway environment
# 3. Run: npm run prisma:migrate

# Prisma will handle schema creation automatically
```

### Disaster Recovery Plan

1. **Data loss prevention**: Railway backups + Git version control
2. **Code rollback**: Git tags/releases for easy rollback
3. **Database rollback**: Use Railway backup restoration (7 days)

## GitHub Actions Integration

The CI/CD workflow (`deploy.yml`) ensures:

- ✅ Code tested before deployment
- ✅ Automatic backups after each deployment
- ✅ Failed deployments don't affect production

## Monitoring & Alerts

To add monitoring (optional):

```env
# Railway dashboard alerts
- CPU usage > 70%
- Memory usage > 80%
- Database connection errors
- API response time > 2s
```

## Checklist for Production

- [x] Database on Railway PostgreSQL
- [x] Environment variables configured
- [x] GitHub Actions CI/CD set up
- [x] Netlify auto-deploys configured
- [x] Railway auto-deploys configured
- [ ] Monitoring alerts configured (optional)
- [ ] Backup retention policy verified
- [ ] Error logging configured (optional)
