# System Architecture

## Overview
The n8n Invoice Automation system consists of the following components:

- **PostgreSQL**: Primary database for invoices, vendors, and error logs
- **n8n**: Workflow automation engine for processing invoices
- **PostgREST**: Auto-generated REST API from PostgreSQL schema
- **React Dashboard**: Frontend for managing and monitoring invoices
- **PGAdmin**: Database administration interface
- **Redis**: Caching layer for session and queue management

## Data Flow
1. Invoices are received via email → n8n workflow
2. n8n parses and stores invoice data in PostgreSQL
3. Dashboard displays invoices via PostgREST API
4. Admin approves/rejects → n8n processes payment
5. Confirmation email sent to vendor
