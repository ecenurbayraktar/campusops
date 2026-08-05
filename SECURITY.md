# CampusOps Security

## Overview

CampusOps uses layered security controls to protect authentication, authorization, credentials, sessions, and sensitive operations.

## Authentication

- Passwords are hashed using bcrypt with a cost factor of 12.
- Access tokens and refresh tokens use separate secrets.
- Access tokens are short-lived.
- Refresh tokens are stored as hashes.
- Refresh token rotation is applied when tokens are refreshed.
- User emails are normalized before authentication.
- Inactive accounts cannot log in.

## Authorization

CampusOps uses role-based access control.

Supported roles:

- STUDENT
- STAFF
- DEPARTMENT_MANAGER
- ADMIN

Access rules:

- Staff areas are accessible to STAFF, DEPARTMENT_MANAGER, and ADMIN.
- Admin areas are accessible only to ADMIN.
- Authentication failures return `401 Unauthorized`.
- Insufficient role permissions return `403 Forbidden`.

## Password Reset

- Password reset tokens are generated using cryptographically secure random bytes.
- Only the SHA-256 hash of a reset token is stored in the database.
- Reset tokens expire after 15 minutes.
- Reset tokens are single-use.
- Existing refresh tokens are revoked after a successful password reset.
- Password reset requests return a generic response to reduce email enumeration risk.
- Reset emails are delivered through Brevo SMTP.

## Rate Limiting

Login attempts are rate-limited to reduce brute-force attacks.

Current verified behavior:

- The first five login requests are accepted within the configured time window.
- The sixth request returns `429 Too Many Requests`.

Rate limits should be adjusted according to deployment traffic and infrastructure requirements.

## Audit Logging

CampusOps records critical security events in the `AuditLog` table.

Examples:

- LOGIN_SUCCESS
- LOGIN_FAILED
- PASSWORD_RESET_REQUESTED
- PASSWORD_RESET_COMPLETED
- USER_CREATED
- USER_UPDATED

Audit records can contain:

- User ID
- User role
- Affected entity
- Affected entity ID
- Metadata
- IP address
- User agent
- Timestamp

IP address and user-agent enrichment are planned for a later improvement.

## Secret Management

Sensitive values are stored in environment variables and must never be committed to source control.

Examples:

- Database credentials
- JWT secrets
- SMTP login
- SMTP key

The `.env` file must remain excluded through `.gitignore`.

For production deployments:

- Use long and randomly generated secrets.
- Keep development and production secrets separate.
- Rotate compromised secrets immediately.
- Revoke and replace exposed SMTP or API keys.
- Use a managed secret-storage system when available.

## Known Limitations

- SMTP currently uses a verified free email address rather than a custom authenticated domain.
- Password reset email links currently point to the future frontend route.
- IP address and user-agent fields are not yet automatically populated.
- Audit-log viewing is currently performed through the database rather than a protected administration endpoint.