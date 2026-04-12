# n8n

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- ngrok (optional, for external webhook access)

### Run Services
```bash
# Start all Docker services
make dev

# Or just Docker Compose
docker compose up -d
```

### Run Dashboard
```bash
cd dashboard
npm install
npm run dev
```

### Access Points
| Service | URL |
|---------|-----|
| Dashboard | http://localhost:5173 |
| n8n | http://localhost:5678 |
| PostgREST API | http://localhost:3000 |
| PGAdmin | http://localhost:5050 |

## Documentation
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database.md)
- [API Reference](docs/api.md)
- [Setup Guide](docs/setup.md)
- [Deployment](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)
