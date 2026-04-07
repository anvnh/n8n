# Troubleshooting Guide

## Common Issues

### PostgREST Connection Error
**Symptom**: Dashboard shows "Error fetching data"
**Fix**: Ensure PostgreSQL and PostgREST containers are running
```bash
docker compose ps
docker compose restart postgrest
```

### n8n Webhook Not Responding
**Symptom**: Approve/Reject buttons fail
**Fix**: Check n8n workflow is active and webhook URL is correct
```bash
# Verify webhook is accessible
curl -X POST http://localhost:5678/webhook/approve-invoice \
  -H "Content-Type: application/json" \
  -d '{"invoiceId": "test", "action": "approve"}'
```

### PGAdmin Can't Connect
**Symptom**: PGAdmin shows connection refused
**Fix**: Use `postgres` as hostname (Docker internal name), not `localhost`
- Host: `postgres`
- Port: `5432`
- Username: `n8n_user`
- Password: `n8n_password`

### Dashboard Build Errors
**Fix**: Clear node_modules and reinstall
```bash
cd dashboard
rm -rf node_modules
npm install
```
