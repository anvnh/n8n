# Database Schema

## Tables

### invoices
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Unique invoice identifier |
| vendor_id | INTEGER | FK to vendors table |
| sender | VARCHAR | Sender email address |
| amount | DECIMAL | Invoice amount |
| status | VARCHAR | Pending/Approved/Rejected/Paid |
| priority | VARCHAR | High/Normal/Low |
| drive_link | TEXT | Google Drive link to document |
| bank_name | VARCHAR | Bank name for payment |
| bank_code | VARCHAR | Bank code |
| account_name | VARCHAR | Account holder name |
| account_number | VARCHAR | Account number |
| created_at | TIMESTAMP | Record creation time |

### vendors
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Auto-increment ID |
| name | VARCHAR | Vendor name |
| created_at | TIMESTAMP | Registration date |

### error_logs
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Auto-increment ID |
| invoice_id | VARCHAR | Related invoice |
| error_message | TEXT | Error description |
| created_at | TIMESTAMP | Error timestamp |
