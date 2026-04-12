# n8n Workflow Documentation

## Active Workflows

### 1. Invoice Email Parser
- **Trigger**: New email received
- **Actions**:
  1. Parse email for invoice attachment
  2. Extract data from PDF/image using OCR
  3. Insert invoice record into PostgreSQL
  4. Upload document to Google Drive
  5. Send notification to admin

### 2. Invoice Approval Processor
- **Trigger**: Webhook `/webhook/approve-invoice`
- **Actions**:
  1. Update invoice status in database
  2. If approved: initiate payment process
  3. Send confirmation email to vendor
  4. Log transaction ID

### 3. Weekly Report Generator
- **Trigger**: Cron - Every Friday at 5:00 PM
- **Actions**:
  1. Query paid invoices for the week
  2. Generate summary report
  3. Send report to admin via email/Telegram

## Workflow Management
```bash
# Export all workflows
make export-workflow

# Import workflows
make import-workflow
```
