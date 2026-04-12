# n8n Setup Guide

## Initial Configuration

### Access n8n
Navigate to `http://localhost:5678` and create owner account.

### Generate API Key
1. Go to Settings > API
2. Create new API key
3. Copy to `dashboard/.env` as `VITE_N8N_API_KEY`

### Import Workflows
```bash
make import-workflow
```

### Configure Credentials
1. **Gmail**: OAuth2 for reading invoice emails
2. **Google Drive**: For storing invoice documents
3. **PostgreSQL**: Internal connection to finance_db
4. **Telegram** (optional): For admin notifications

## Webhook Configuration
Webhooks are automatically created when workflows are active.
- Production URL: `https://your-domain/webhook/approve-invoice`
- Test URL: `http://localhost:5678/webhook-test/approve-invoice`

## Backup & Restore
```bash
# Export
make export-workflow
make export-cre

# Import
make import-workflow
make import-cre
```
