# Banking System API

A simple Banking System backend built with Node.js, Express and MongoDB. It provides user authentication, account management and transaction handling (including system-initiated initial funds).

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Run (Development / Production)](#run-development--production)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling & Logging](#error-handling--logging)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This repo implements a minimal banking backend exposing JSON APIs for:
- User registration and login (JWT authentication)
- Creating and managing accounts per user
- Creating transactions between accounts and system-initiated transactions

It is intended as a reference or starting point for a ledger-style banking application.

## Features

- User authentication (register / login / logout)
- JWT-based protected routes
- Account creation and retrieval
- Account balance retrieval
- Transaction creation (user-initiated)
- System-initiated transaction endpoint for initial funds
- Nodemailer-based email service available in `src/services`

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- nodemailer (email service)

## Prerequisites

- Node.js 18+ (or a recent LTS)
- npm or yarn
- A running MongoDB instance or MongoDB Atlas connection string

## Environment Variables

Copy and populate the example file: [.env.example](.env.example)

Required variables (from `.env.example`):

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret used to sign JWT tokens
- `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `EMAIL_USER` — values used by the included email service

## Installation

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd Banking-System
npm install
```

Create a `.env` file based on `.env.example` and fill values.

## Run (Development / Production)

- Development (auto-restarts):

```bash
npm run dev
```

- Production:

```bash
npm start
```

By default the server listens on port `3000` (see `server.js`). See [server.js](server.js) and [package.json](package.json) for details.

## Project Structure

- `server.js` — application entry point ([server.js](server.js))
- `package.json` — dependencies and scripts ([package.json](package.json))
- `src/app.js` — Express app configuration ([src/app.js](src/app.js))
- `src/config/db.js` — MongoDB connection helper ([src/config/db.js](src/config/db.js))
- `src/controllers/` — request handlers ([src/controllers](src/controllers))
- `src/routes/` — API route definitions ([src/routes](src/routes))
- `src/middleware/auth.middleware.js` — authentication middleware ([src/middleware/auth.middleware.js](src/middleware/auth.middleware.js))
- `src/models/` — Mongoose models ([src/models](src/models))
- `src/services/email.service.js` — email helper ([src/services/email.service.js](src/services/email.service.js))

Full tree available in the repository root and `src/` folder.

## API Endpoints

Base path: `/api`

### Authentication

- `POST /api/auth/register` — Register a new user
  - Body: `{ "name", "email", "password" }`
  - Controller: [src/controllers/auth.controller.js](src/controllers/auth.controller.js)

- `POST /api/auth/login` — Login and receive JWT
  - Body: `{ "email", "password" }`
  - Controller: [src/controllers/auth.controller.js](src/controllers/auth.controller.js)

- `POST /api/auth/logout` — Logout (depends on implementation in controller)

Example register request with curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"P@ssw0rd"}'
```

### Accounts

- `POST /api/accounts/` — Create a new account (Protected)
  - Protected: requires `Authorization: Bearer <token>` header
  - Controller: [src/routes/account.routes.js](src/routes/account.routes.js)

- `GET /api/accounts/` — Get all accounts for current user (Protected)

- `GET /api/accounts/balance/:accountId` — Get balance for a specific account (Protected)

Example create-account request (replace `<TOKEN>`):

```bash
curl -X POST http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Savings","type":"savings","initialBalance":1000}'
```

See route definitions in [src/routes/account.routes.js](src/routes/account.routes.js).

### Transactions

- `POST /api/transactions/` — Create a transaction (Protected)
  - Controller: [src/controllers/transaction.controller.js](src/controllers/transaction.controller.js)

- `POST /api/transactions/system/initial-funds` — Create system-initiated initial funds transaction
  - Protected by a system-user middleware: use only for provisioning initial balances

Example create-transaction request:

```bash
curl -X POST http://localhost:3000/api/transactions/ \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId":"<FROM>","toAccountId":"<TO>","amount":100,"description":"Transfer"}'
```

## Authentication

This project uses JWT tokens signed with `JWT_SECRET` (see [.env.example](.env.example)). Protect routes by sending the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

The authentication middleware lives in [src/middleware/auth.middleware.js](src/middleware/auth.middleware.js).

## Error Handling & Logging

Controllers generally return JSON error responses with appropriate HTTP status codes. Inspect individual controllers in `src/controllers/` to see exact response shapes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests where appropriate
4. Open a pull request with a clear description of your changes

Before contributing, ensure your linting & formatting matches the project conventions.

## Notes & Next Steps

- Add unit and integration tests (none included by default)
- Harden validation and error responses
- Add pagination and filtering for account/transaction list endpoints
- Add rate limiting and stronger security headers for production


