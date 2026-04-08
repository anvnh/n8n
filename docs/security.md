# Security Considerations

## Current Security Model

### PostgREST
- Anonymous role access (`n8n_user`)
- No row-level security currently
- Access controlled by network/firewall

### n8n Webhooks
- No authentication on webhook endpoints
- `ngrok-skip-browser-warning` header required
- Internal network only in production

### Database
- Credentials managed via environment variables
- PostgreSQL accessible only within Docker network
- PGAdmin behind basic auth

## Planned Improvements
- [ ] JWT authentication for dashboard users
- [ ] Role-based access control (RBAC)
- [ ] Row-level security in PostgreSQL
- [ ] API rate limiting
- [ ] Audit logging for all actions
- [ ] HTTPS enforcement in production
