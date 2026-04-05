# PostgREST API Reference

Base URL: `http://localhost:3000`

## Endpoints

### GET /invoices
Fetch all invoices from the database.

### GET /vendors
Fetch all registered vendors.

### GET /error_logs
Fetch system error logs.

## Filtering
PostgREST supports query parameters for filtering:
```
GET /invoices?status=eq.Pending
GET /invoices?amount=gt.1000
GET /invoices?order=created_at.desc
```

## n8n Webhooks
- `POST /webhook/approve-invoice` — Approve or reject an invoice
- `POST /webhook/trigger-workflow` — Manually trigger a workflow
