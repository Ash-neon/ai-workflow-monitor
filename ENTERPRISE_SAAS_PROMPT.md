# Enterprise SaaS Platform Builder Prompt

## FOUNDATIONAL SAAS PLATFORM DESIGN

You are a Senior Principal Engineer and SaaS Platform Architect.

Design a **FOUNDATIONAL, ENTERPRISE-GRADE SaaS PLATFORM** that can serve as the base layer for **ANY SaaS PRODUCT**, following Amazon-style principles:
- customer-obsessed
- scalable by default
- secure by default
- modular and reusable
- minimal assumptions
- zero-cost-first

This is NOT a single app.  
This is a **reusable SaaS operating system** that any product team could build on top of.

Do NOT name specific cloud providers, frameworks, or paid services.
Design everything to run on:
- free tiers
- open-source
- self-hosted infrastructure
with the ability to swap components later without redesign.

Assume the platform must be **deployable tomorrow** in a minimal form and **scale to enterprise usage** without architectural changes.

---

## AMAZON-STYLE PRODUCT PRINCIPLES (MANDATORY)

- Every capability must exist for a reason.
- Prefer simple primitives over clever abstractions.
- All services must have clear ownership and boundaries.
- Everything is multi-tenant, observable, auditable, and secure by default.
- No feature depends on a paid vendor to function.

---

## NON-NEGOTIABLE PLATFORM CAPABILITIES

### 1) Multi-tenancy
- Strong tenant isolation
- Tenant-aware authorization on every request
- Per-tenant limits, configuration, and lifecycle

### 2) Identity & Access
- Email/password + MFA
- Enterprise SSO (OIDC/SAML)
- SCIM provisioning
- API keys + service identities

### 3) Authorization
- RBAC + policy-based checks
- Feature entitlements per tenant
- Quotas and usage enforcement

### 4) Billing (Zero-Cost-First)
- Manual invoicing mode (default)
- Usage metering independent of payment processor
- Pluggable payment integration (optional, not required)
- Dunning and account state machine

### 5) Security & Compliance
- SOC2-ready baseline
- GDPR DSAR (export/delete)
- Immutable audit logs
- Encryption in transit and at rest
- OWASP protections applied by default

### 6) Reliability
- Health checks
- Retries and idempotency
- Background processing with DLQ
- RPO/RTO defined and achievable
- Zero-downtime releases

### 7) Observability
- Structured logs
- Metrics
- Tracing
- Actionable alerts
- Runbooks

### 8) Operations
- CI/CD
- Infrastructure as Code (generic)
- Environment separation (dev/stage/prod)
- Rollback and incident response

---

## OUTPUT FORMAT (FOLLOW EXACTLY)

### SECTION 1 — PLATFORM OVERVIEW (AMAZON-STYLE)
- What this SaaS platform enables
- What problems it solves for product teams
- Who the "customers" are (end users, admins, internal teams)
- Core guarantees (security, isolation, reliability)
- Assumed scale (early / growth / enterprise)

### SECTION 2 — PLATFORM ARCHITECTURE (TEXT DIAGRAMS)

**2.1 Context Diagram**  
Actors → Platform → External Integrations

**2.2 Container Diagram**  
UI | API | Auth | Billing | Worker | Data | Queue | Storage | Observability

**2.3 Component Diagram (Platform Internals)**  
Show internal modules and boundaries.

For each component:
- Responsibility
- Inputs/outputs
- Failure modes
- Why it exists

### SECTION 3 — MULTI-TENANCY & REQUEST FLOW
- Tenant model
- Tenant resolution flow
- Request lifecycle:
  request → auth → tenant → policy → data → response
- Tenant isolation guarantees
- Tenant lifecycle (create, suspend, delete)

### SECTION 4 — IDENTITY & AUTHORIZATION MODEL
- User, service, and system identities
- Role and permission model
- Policy evaluation logic
- MFA and session management
- SSO and SCIM flows (generic)

### SECTION 5 — DATA MODEL (FOUNDATIONAL)

Provide a generic ERD and table definitions:
- tenants
- users
- memberships
- roles
- permissions
- sessions
- api_keys
- plans
- subscriptions
- entitlements
- usage_records
- invoices
- audit_logs (immutable)
- dsar_requests
- retention_policies
- background_jobs
- files
- webhooks_in / webhooks_out

Include:
- indexing strategy
- tenant enforcement rules
- soft delete + audit strategy

### SECTION 6 — API DESIGN (PLATFORM-LEVEL)
- API standards (versioning, errors, pagination)
- Core API groups:
  Auth, Tenants, RBAC, Usage, Billing, Admin, Audit, DSAR, Files
- Example request/response payloads for critical flows
- Idempotency rules
- Webhook signing and verification

### SECTION 7 — ASYNC PROCESSING & EVENTS
- Event types and schemas
- Background job categories
- Retry and DLQ strategy
- Idempotency model
- Backpressure handling

### SECTION 8 — SECURITY BASELINE (ZERO-COST-FIRST)
- Threat model (top risks)
- OWASP protections mapped to layers
- Secrets handling (generic)
- Immutable audit log strategies
- Secure file handling
- Supply-chain security with free tooling
- Break-glass access model

### SECTION 9 — OBSERVABILITY & OPERATIONS
- Logging standards
- Metrics and SLOs
- Tracing approach
- Alert thresholds
- Runbooks for common incidents

### SECTION 10 — BILLING & ENTITLEMENTS (PLATFORM-LEVEL)
- Manual billing mode (default)
- Usage metering design
- Entitlement enforcement
- Subscription state machine
- Optional payment processor integration (plug-in model)

### SECTION 11 — DEPLOYMENT MODEL (PROVIDER-AGNOSTIC)
- Minimal deploy (single-node)
- Scale-out model
- CI/CD pipeline steps
- IaC approach
- Rollback strategy
- Environment promotion

### SECTION 12 — "DEPLOY TOMORROW" CHECKLIST
- Required configuration
- Secrets to generate
- Initial admin bootstrap
- Smoke test flows
- Security verification
- Observability verification
- Backup/restore test

---

## PROBLEM-SPECIFIC CUSTOMIZATION

After generating the foundational platform design above, customize it for the specific problem discovered from Reddit:

**Problem Domain:** [Insert Reddit problem here]

**Product-Specific Features:**
Build on top of the foundational platform to solve the specific problem:
- Core product features (3-5 key features)
- Product-specific data models (extend base schema)
- Product-specific API endpoints
- Product-specific UI/UX
- Product-specific workflows

**Integration Points:**
- How product features use platform tenancy
- How product features use platform auth/authz
- How product features use platform billing/metering
- How product features use platform audit logs

---

## CODE GENERATION REQUIREMENTS

Generate complete, production-ready code:

### Backend Files
1. **package.json** - All dependencies
2. **server.js** - Complete platform + product backend
3. **middleware/tenant.js** - Tenant isolation middleware
4. **middleware/auth.js** - Authentication middleware
5. **middleware/rbac.js** - Authorization middleware
6. **middleware/ratelimit.js** - Rate limiting middleware
7. **services/auth.js** - Auth service (email/password, MFA, SSO)
8. **services/tenant.js** - Tenant management
9. **services/billing.js** - Billing and metering
10. **services/audit.js** - Audit logging
11. **services/webhook.js** - Webhook system
12. **services/background.js** - Background jobs

### Database Files
13. **database/schema.sql** - Complete schema (20+ tables)
14. **database/migrations/001_initial.sql** - Initial migration
15. **database/migrations/002_indexes.sql** - Index creation
16. **database/seeds/plans.sql** - Billing plans seed data
17. **database/seeds/roles.sql** - RBAC roles seed data

### Configuration Files
18. **config/rbac.json** - RBAC configuration
19. **config/plans.json** - Billing plans
20. **config/entitlements.json** - Feature entitlements
21. **config/quotas.json** - Usage quotas

### Frontend Files
22. **public/index.html** - Landing page + dashboard
23. **public/css/platform.css** - Platform UI styles
24. **public/js/platform.js** - Platform UI logic
25. **public/js/product.js** - Product-specific UI

### Documentation Files
26. **docs/PLATFORM.md** - Platform architecture
27. **docs/API.md** - Complete API documentation
28. **docs/SECURITY.md** - Security documentation
29. **docs/DEPLOYMENT.md** - Deployment guide
30. **docs/RUNBOOKS.md** - Operational runbooks
31. **docs/PRODUCT.md** - Product-specific documentation

### Deployment Files
32. **.env.example** - All environment variables
33. **.gitignore** - Proper gitignore
34. **railway.json** - Railway deployment config
35. **docker-compose.yml** - Local development setup
36. **Dockerfile** - Container definition

### Root Files
37. **README.md** - Comprehensive documentation
38. **CHANGELOG.md** - Version history
39. **LICENSE** - MIT license

---

## PLATFORM FEATURES CHECKLIST

Every build must include:

### Multi-Tenancy
✅ Tenant isolation at database level
✅ Tenant resolution from subdomain/header/token
✅ Tenant-aware queries enforced
✅ Per-tenant configuration
✅ Tenant lifecycle management

### Identity & Access
✅ Email/password authentication
✅ MFA (TOTP) support
✅ SSO (SAML/OIDC) integration
✅ SCIM provisioning endpoints
✅ API key management
✅ Service identities
✅ Session management
✅ Token rotation

### Authorization
✅ RBAC with roles and permissions
✅ Policy-based authorization
✅ Feature entitlements per tenant
✅ Usage quotas enforcement
✅ Rate limiting (IP/user/tenant)

### Billing & Metering
✅ Manual invoicing mode
✅ Usage metering system
✅ Subscription management
✅ Invoice generation
✅ Dunning workflows
✅ Entitlement enforcement
✅ Proration support
✅ Webhook integration ready

### Security & Compliance
✅ SOC2-ready controls
✅ GDPR DSAR (export/delete)
✅ Immutable audit logs
✅ Encryption in transit (TLS)
✅ Encryption at rest
✅ Secret management
✅ OWASP protections
✅ Dependency scanning
✅ Secure file uploads
✅ Break-glass access

### Reliability
✅ Health check endpoints
✅ Retry logic with exponential backoff
✅ Idempotency keys
✅ Background job processing
✅ Dead letter queue
✅ Circuit breakers
✅ Graceful degradation
✅ Zero-downtime deployments
✅ Blue/green deployment support

### Observability
✅ Structured JSON logging
✅ Correlation IDs
✅ Metrics collection
✅ Distributed tracing
✅ Dashboards
✅ SLO-based alerting
✅ Runbooks for incidents

### Operations
✅ CI/CD pipeline
✅ Infrastructure as Code
✅ Environment separation
✅ Database migrations
✅ Rollback procedures
✅ Backup/restore
✅ DR plan (RPO/RTO)

---

## DATABASE SCHEMA (MINIMUM 20 TABLES)

### Core Platform Tables
1. tenants
2. users
3. memberships
4. roles
5. permissions
6. role_permissions
7. user_roles
8. sessions
9. api_keys
10. mfa_devices

### SSO & Provisioning
11. sso_connections
12. scim_identities
13. saml_assertions

### Billing & Usage
14. plans
15. subscriptions
16. entitlements
17. usage_records
18. invoices
19. invoice_items
20. payments

### Compliance & Audit
21. audit_logs
22. dsar_requests
23. retention_policies
24. data_exports

### System
25. background_jobs
26. files
27. webhooks_out
28. webhook_events_in
29. rate_limits
30. feature_flags

---

## API ENDPOINTS (MINIMUM 30 ENDPOINTS)

### Authentication (6)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- POST /api/auth/mfa/setup
- POST /api/auth/mfa/verify

### SSO (4)
- GET /api/auth/sso/saml/metadata
- POST /api/auth/sso/saml/acs
- GET /api/auth/sso/oidc/authorize
- POST /api/auth/sso/oidc/callback

### Tenants (4)
- GET /api/tenants
- POST /api/tenants
- GET /api/tenants/:id
- PATCH /api/tenants/:id

### Users (4)
- GET /api/users
- POST /api/users
- GET /api/users/:id
- PATCH /api/users/:id

### RBAC (4)
- GET /api/roles
- POST /api/roles
- GET /api/permissions
- POST /api/user-roles

### Billing (5)
- GET /api/subscriptions
- POST /api/subscriptions
- GET /api/invoices
- GET /api/usage
- POST /api/usage

### Audit & Compliance (3)
- GET /api/audit-logs
- POST /api/dsar/export
- POST /api/dsar/delete

### Files (2)
- POST /api/files/upload
- GET /api/files/:id

### Webhooks (2)
- POST /api/webhooks
- GET /api/webhooks

### System (2)
- GET /api/health
- GET /api/metrics

---

## ASSUMPTIONS

- **SaaS domain:** [Problem from Reddit]
- **Region:** Global
- **Expected users:** 200 month 1 / 2,000 month 6
- **Compliance:** SOC2-ready + GDPR baseline
- **Budget:** $0 (free tiers + self-host)

---

## EXECUTION INSTRUCTIONS

1. Generate the complete foundational platform design following all 12 sections
2. Customize the platform for the specific Reddit problem
3. Generate all 39 code files with production-ready implementation
4. Ensure zero-cost-first approach (no paid dependencies)
5. Make everything provider-agnostic and swappable
6. Include comprehensive documentation
7. Provide deployment-ready configuration

Now generate the full SaaS platform design and code.