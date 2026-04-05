# Development Setup Guide

## Prerequisites
- Docker & Docker Compose
- Node.js 18+
- ngrok (for external webhook access)

## Quick Start

```bash
# Start all services
make dev

# Access points:
# n8n:       http://localhost:5678
# PostgREST: http://localhost:3000
# PGAdmin:   http://localhost:5050
# Dashboard: http://localhost:5173
```

## PGAdmin Login
- Email: admin@admin.com
- Password: admin

## Import/Export Workflows
```bash
make import-workflow
make export-workflow
```
