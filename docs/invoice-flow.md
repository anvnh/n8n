# Invoice Processing Flow

## Status Lifecycle

```
Email Received
    │
    ▼
┌──────────┐
│ PENDING  │ ← Initial state after n8n parses email
└────┬─────┘
     │
     ├── Admin clicks "Approve"
     │       │
     │       ▼
     │  ┌──────────┐
     │  │ APPROVED │ ← n8n processes payment
     │  └────┬─────┘
     │       │
     │       ▼
     │  ┌──────────┐
     │  │   PAID   │ ← Payment confirmed, transaction ID assigned
     │  └──────────┘
     │
     └── Admin clicks "Reject"
             │
             ▼
        ┌──────────┐
        │ REJECTED │ ← Notification sent to vendor
        └──────────┘
```

## Automation Triggers
1. **Email → n8n**: New invoice email triggers parsing workflow
2. **Dashboard → n8n**: Approve/Reject triggers payment workflow
3. **n8n → Database**: Status updates written to PostgreSQL
4. **n8n → Email**: Confirmation emails sent automatically
5. **n8n → Cron**: Weekly reports generated every Friday
