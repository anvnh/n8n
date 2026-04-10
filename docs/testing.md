# Testing Guide

## Manual Testing Checklist

### Dashboard
- [ ] Stats cards display correct counts
- [ ] Pending approvals list loads
- [ ] Error logs section shows recent entries
- [ ] Navigation links work correctly

### Invoices
- [ ] Invoice list loads from PostgREST
- [ ] Status filter tabs work
- [ ] Search by ID and sender works
- [ ] Approve button triggers n8n webhook
- [ ] Reject button triggers n8n webhook
- [ ] Invoice detail page loads correctly
- [ ] Drive link opens in new tab

### Reports
- [ ] Revenue chart displays weekly data
- [ ] Status pie chart shows breakdown
- [ ] Paid invoices table populates
- [ ] CSV export downloads file

### Vendors
- [ ] Vendor list loads from PostgREST
- [ ] Registration date formats correctly

### Error Logs
- [ ] Error log list loads
- [ ] Invoice ID links navigate to detail

## API Testing
```bash
# Test PostgREST
curl http://localhost:3000/invoices
curl http://localhost:3000/vendors
curl http://localhost:3000/error_logs

# Test n8n webhook
curl -X POST http://localhost:5678/webhook/approve-invoice \
  -H "Content-Type: application/json" \
  -d '{"invoiceId": "INV-001", "action": "approve"}'
```
