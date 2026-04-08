# Contributing Guide

## Development Workflow

### Branch Naming
- `feature/*` — New features
- `fix/*` — Bug fixes
- `docs/*` — Documentation
- `chore/*` — Maintenance

### Commit Messages
Follow Conventional Commits:
```
feat: add invoice approval workflow
fix: resolve PostgREST connection timeout
docs: update API reference
chore: update dependencies
style: improve dashboard card layout
```

### Code Review
1. Create a Pull Request with clear description
2. Request review from at least 1 team member
3. Address all review comments
4. Merge after approval

## Project Structure
```
├── docker-compose.yml  # Infrastructure services
├── dashboard/          # React frontend (Vite)
├── n8n_data/          # n8n data directory
├── workflows/         # Exported n8n workflows
└── docs/              # Documentation
```
