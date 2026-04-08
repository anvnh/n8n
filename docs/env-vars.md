# Environment Variables Reference

## Root `.env`
| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_USER | PostgreSQL username | n8n_user |
| POSTGRES_PASSWORD | PostgreSQL password | n8n_password |
| POSTGRES_DB | Database name | finance_db |

## Dashboard `.env`
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_N8N_BASE_URL | n8n instance URL | Yes |
| VITE_N8N_API_KEY | n8n API key for REST calls | Yes |
| VITE_WEBHOOK_BASE_URL | Base URL for n8n webhooks | Yes |
| VITE_POSTGREST_BASE_URL | PostgREST API URL | Yes |

## Docker Compose Variables
| Variable | Description |
|----------|-------------|
| N8N_HOST | n8n bind address |
| N8N_PORT | n8n port (default 5678) |
| WEBHOOK_URL | External webhook URL |
| DB_TYPE | Database type (postgresdb) |
