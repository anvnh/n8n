# PostgREST Configuration

## How PostgREST Works
PostgREST automatically generates a REST API from your PostgreSQL schema.

## Configuration (docker-compose.yml)
```yaml
PGRST_DB_URI: postgres://n8n_user:n8n_password@postgres:5432/finance_db
PGRST_DB_SCHEMA: public
PGRST_DB_ANON_ROLE: n8n_user
```

## Available Endpoints
PostgREST creates endpoints for each table:
- `GET /invoices` — List all invoices
- `GET /invoices?id=eq.INV-001` — Get specific invoice
- `POST /invoices` — Create new invoice
- `PATCH /invoices?id=eq.INV-001` — Update invoice
- `DELETE /invoices?id=eq.INV-001` — Delete invoice

## Filtering Examples
```bash
# Filter by status
curl http://localhost:3000/invoices?status=eq.Pending

# Filter by amount range
curl http://localhost:3000/invoices?amount=gte.1000&amount=lte.5000

# Order by date
curl http://localhost:3000/invoices?order=created_at.desc

# Limit results
curl http://localhost:3000/invoices?limit=10&offset=0
```
