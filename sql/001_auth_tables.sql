-- ═══════════════════════════════════════════════════════════
-- Migration 001: Authentication & Authorization Tables
-- Run this in PGAdmin against the finance_db database
-- ═══════════════════════════════════════════════════════════

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client'
        CHECK (role IN ('super_admin', 'admin', 'client')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Automation rules table
CREATE TABLE IF NOT EXISTS auto_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(20) NOT NULL
        CHECK (rule_type IN ('auto_approve', 'auto_reject', 'auto_flag')),
    conditions JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Seed 3 demo users with bcrypt-hashed passwords
-- super123 / admin123 / client123

INSERT INTO users (email, password_hash, name, role) VALUES
    ('super@demo.com', '$2b$10$tnEmsgt1cy9Np/EqdyYACuDlgihl9XhoXs/7jfaI/hLX3Q75CWIhm', 'Nguyễn Văn Anh', 'super_admin'),
    ('admin@demo.com', '$2b$10$/nZKJkPOaPY/ZYYVq9Rh..UWaAhvIVjE7EyKTQaygomW3p4iTV47G', 'Trần Minh Tuấn', 'admin'),
    ('client@demo.com', '$2b$10$4pxjfVuXDB1jbp6SuChjrevEy.SVT4U14x3E.9Q/P/BlszT9hhbtS', 'Lê Thị Hoa', 'client')
ON CONFLICT (email) DO NOTHING;

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auto_rules_is_active ON auto_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 6. Grant access to PostgREST role
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO n8n_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON audit_logs TO n8n_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON auto_rules TO n8n_user;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO n8n_user;
GRANT USAGE, SELECT ON SEQUENCE audit_logs_id_seq TO n8n_user;
GRANT USAGE, SELECT ON SEQUENCE auto_rules_id_seq TO n8n_user;
