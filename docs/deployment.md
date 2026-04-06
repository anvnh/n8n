# Deployment Guide

## VPS Deployment

### Prerequisites
- Ubuntu 22.04+ VPS
- Docker & Docker Compose installed
- Domain name (optional, can use DuckDNS)

### Steps

1. Clone the repository
```bash
git clone git@github.com:anvnh/n8n.git
cd n8n
```

2. Configure environment
```bash
cp .env.example .env
# Edit .env with production values
```

3. Start services
```bash
docker compose up -d
```

4. Configure ngrok/DuckDNS for external access
```bash
ngrok http --domain=your-domain.ngrok-free.app 5678
```

## SSL/HTTPS
For production, configure nginx reverse proxy with Let's Encrypt SSL.
