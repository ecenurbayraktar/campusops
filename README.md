# CampusOps

CampusOps is a secure and modular university operations management system built with NestJS, PostgreSQL, and Prisma.

The project aims to centralize academic and administrative operations such as user management, departments, courses, role-based access, security monitoring, and future AI-assisted campus services.

## Current Status

CampusOps is currently under active development.

Completed backend phases include:

- User management
- Department management
- Course management
- Authentication
- Role-based authorization
- API security
- Password reset via email
- Audit logging

## Core Features

### User Management

- Create and manage users
- Unique and normalized email addresses
- Active and inactive account support
- Default `STUDENT` role
- Department assignment

### Department Management

- Create, list, update, and deactivate departments
- Unique department names and codes
- Department-user relationships

### Course Management

- Create and manage courses
- Associate courses with departments
- Validate relational integrity through Prisma

### Authentication

- User registration
- Login and logout
- JWT access tokens
- Refresh tokens
- Refresh token rotation
- Hashed refresh token storage
- Password hashing with bcrypt
- Last-login tracking

### Authorization

CampusOps uses role-based access control.

Supported roles:

- `STUDENT`
- `STAFF`
- `DEPARTMENT_MANAGER`
- `ADMIN`

Access rules:

- Staff areas are available to `STAFF`, `DEPARTMENT_MANAGER`, and `ADMIN`.
- Administration areas are available only to `ADMIN`.
- Unauthenticated requests return `401 Unauthorized`.
- Insufficient permissions return `403 Forbidden`.

### Password Reset

- Secure reset-token generation
- SHA-256 hashed token storage
- 15-minute expiration period
- Single-use reset tokens
- Password reset emails through Brevo SMTP
- Refresh-token revocation after password changes
- Protection against email enumeration

### API Security

- Login rate limiting
- Fake JWT rejection
- Expired JWT rejection
- Secure password hashing
- Separate access-token and refresh-token secrets
- Environment-based secret management
- IDOR security analysis

### Audit Logging

Critical security events are stored in the database.

Examples:

- `LOGIN_SUCCESS`
- `LOGIN_FAILED`
- `PASSWORD_RESET_REQUESTED`
- `PASSWORD_RESET_COMPLETED`
- `USER_CREATED`
- `USER_UPDATED`

Audit records support:

- Action
- User ID
- User role
- Related entity
- Related entity ID
- Metadata
- IP address
- User agent
- Timestamp

## Technology Stack

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- Passport
- JWT
- bcrypt
- class-validator
- Brevo SMTP
- Nodemailer

### Development Tools

- Visual Studio Code
- Thunder Client
- Prisma Studio
- Git
- GitHub

## Project Structure

```text
campusops/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── audit/
│       ├── auth/
│       ├── courses/
│       ├── departments/
│       ├── mail/
│       ├── prisma/
│       ├── users/
│       └── main.ts
├── docs/
│   └── security-test-matrix.md
├── diagrams/
├── SECURITY.md
└── README.md
```

## Getting Started

### Requirements

Make sure the following tools are installed:

- Node.js
- npm
- Docker Desktop
- PostgreSQL-compatible Docker environment

### Clone the Repository

```bash
git clone https://github.com/ecenurbayraktar/campusops.git
cd campusops/backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` directory.

Required variables include:

```env
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM_NAME=
MAIL_FROM_EMAIL=

FRONTEND_URL=
```

Do not commit real credentials or secret values.

### Run Database Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### Start the Application

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

### Open Prisma Studio

```bash
npx prisma studio
```

## Available Scripts

```bash
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Security Documentation

Detailed security decisions and known limitations are documented in:

- `SECURITY.md`
- `docs/security-test-matrix.md`

## Roadmap

Planned development areas include:

- Extended audit-log management
- IP address and user-agent enrichment
- Protected administration endpoints
- Record and request management workflows
- Notification infrastructure
- Frontend dashboard
- Campus assistant chat interface
- AI-assisted university operations
- Reporting and analytics
- Automated testing
- Deployment and CI/CD

## Project Vision

CampusOps is designed to evolve beyond a traditional university CRUD application.

The long-term goal is to create a secure, role-aware, AI-assisted campus operations platform where students and university staff can access information, manage operational workflows, and interact with university services through a centralized system.

## Author

**Ece Nur Bayraktar**

Computer Engineering Student  
AI and Software Development Enthusiast
