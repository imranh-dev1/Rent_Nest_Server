# RentNest Backend

A production-ready REST API for a modern rental property marketplace built with Node.js, Express, TypeScript, Prisma, PostgreSQL, and Stripe.

![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express.js-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF)
![License](https://img.shields.io/badge/License-MIT-green)

**Live API:** `https://rent-nest-server-red.vercel.app/` 

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API |
| TypeScript | Type safety |
| PostgreSQL + Prisma | Database + ORM |
| JWT (access + refresh) | Authentication |
| Zod | Request validation |
| Stripe | Payment processing |
| Swagger / Postman | API documentation |

---

## ✨ Features

- JWT Authentication
- Role-based Authorization
- Property Management
- Rental Request Workflow
- Stripe Checkout Integration
- Stripe Webhook Verification
- Property Reviews
- Admin Dashboard
- Search & Filtering
- Pagination
- Secure Validation using Zod

---

## 🗄 Database

- Users
- Categories
- Properties
- RentalRequests
- Payments
- Reviews

---

## 🗄 Database Schema

- **ER Diagram:** https://dbdiagram.io/d/Rent_Nest_Backend-6a51d1594ac62e474c7f5316

## 📁 Project Structure

```
src/
├── config/             # env config, jwt, stripe, prisma client
├── errors/             # AppError, globalErrorHandler
├── lib/                
├── middlewares/        # auth (role-based), validateRequest, notFound
├── modules/
│   ├── auth/            # register, login, refresh-token, me
│   ├── category/         # admin CRUD + public read
│   ├── property/          # public browse/filter + landlord CRUD + availability
│   ├── rental/             # rental request lifecycle (PENDING → COMPLETED)
│   ├── payment/             # Stripe checkout + webhook confirmation
│   ├── review/               # tenant reviews (only after COMPLETED rental)
│   └── admin/                 # user management, platform overview
├── utils/              # asyncHandler, ApiResponse
├── app.ts              # Express app + route mounting
└── server.ts            # entry point (DB connect + listen)
prisma/
└── schema.prisma        # Users, Categories, Properties, RentalRequests, Payments, Reviews

```

---

## 🚀 Getting Started (Local)

```bash
git clone [https://github.com/imranh-dev1/Rent_Nest_Server](https://github.com/imranh-dev1/Rent_Nest_Server)
cd rentnest-backend
npm install
cp .env.example .env      # fill in your values, see below
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Server runs at `http://localhost:5000`.

---

## 🔐 Environment Variables

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/rentnest?schema=public"
APP_URL="http://localhost:3000"
CLIENT_URL="http://localhost:3000"

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-another-long-random-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

ADMIN_EMAIL="admin@rentnest.com"
ADMIN_PASSWORD="Admin@12345"
```

---

## 👤 Admin Credentials (seeded)

| Field | Value |
|---|---|
| Email | `admin@rentnest.com` (or whatever you set in `ADMIN_EMAIL`) |
| Password | `Admin@12345` (or whatever you set in `ADMIN_PASSWORD`) |

---

## 📡 API Response Format

**Success:**
```json
{ "success": true, "statusCode": "status.OK", "message": "...", "data": { } }
```

**Error:**
```json
{ "success": false, "statusCode": "status.INTERNAL_SERVER_ERROR", "message": "...", "errorDetails": { } }
```

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| PATCH | `/api/auth/update-me` | Authenticated |

### Categories
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/categories` | Public |
| GET | `/api/categories/:id` | Public |
| POST | `/api/categories` | Admin |
| PATCH | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Properties
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/properties` | Public (filters: `city`, `categoryId`, `minPrice`, `maxPrice`, `bedrooms`, `search`) |
| GET | `/api/properties/:id` | Public |
| POST | `/api/properties` | Landlord |
| PATCH | `/api/properties/:id` | Landlord (owner only) |
| PATCH | `/api/properties/:id/availability` | Landlord (owner only) |
| DELETE | `/api/properties/:id` | Landlord (owner only) |
| GET | `/api/properties/my-properties` | Landlord |

### Rental Requests
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/rental-requests` | Tenant |
| GET | `/api/rental-requests` | Tenant (own) |
| GET | `/api/rental-requests/:id` | Owner |
| GET | `/api/rental-requests/landlord` | Landlord |
| PATCH | `/api/rental-requests/:id/status` | Landlord (APPROVED / REJECTED only) |
| PATCH | `/api/rental-requests/:id/cancel` | Tenant |

### Payments
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/payments/create` | Tenant |
| POST | `/api/payments/webhook` | Stripe (signature-verified) |
| GET | `/api/payments` | Owner |
| GET | `/api/payments/:id` | Owner |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews/:propertyId` | Tenant (only after COMPLETED rental) |
| GET | `/api/reviews/:propertyId` | Tenant |
| PATCH | `/api/reviews/:id` | Tenant |
| DELETE | `/api/reviews/:id` | Tenant |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/dashboard` | Admin (platform stats overview) |
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id/status` | Admin (ban/unban — body: `{ "status": "ACTIVE" \| "BANNED" }`) |
| GET | `/api/admin/properties` | Admin |
| GET | `/api/admin/properties/:id` | Admin |
| DELETE | `/api/admin/properties/:id` | Admin |
| GET | `/api/admin/rental-requests` | Admin |
| GET | `/api/admin/rental-requests/:id` | Admin |
| GET | `/api/admin/reviews` | Admin |
| DELETE | `/api/admin/reviews/:id` | Admin (content moderation) |

---

## 🔄 Rental Request State Machine

```
PENDING ──(landlord approves)──> APPROVED ──(tenant pays via Stripe)──> ACTIVE ──> COMPLETED
   │
   └──(landlord rejects)──> REJECTED
```

- Payment can only be created for an `APPROVED` request.
- Stripe webhook flips status to `ACTIVE` on successful payment.
- Reviews can only be submitted for a `COMPLETED` rental request.

---

## 💳 Payment Flow (Stripe)

1. Tenant calls `POST /api/payments/create` with an `APPROVED` `rentalRequestId`.
2. Server creates a Stripe Checkout Session and a `PENDING` `Payment` record.
3. Tenant completes payment on Stripe's hosted checkout page.
4. Stripe calls `POST /api/payments/webhook` → server verifies the signature, marks payment `COMPLETED`, and updates the rental request to `ACTIVE`.

**Test card:** `4242 4242 4242 4242`, any future expiry, any CVC.

**Local webhook testing:**
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` in `.env`.

---
 
## 📄 API Documentation
 
- Postman collection: `docs/RentNest.postman_collection.json`


## 👨‍💻 Author

**Imran Hossain**

GitHub:
https://github.com/imranh-dev1

LinkedIn:
https://www.linkedin.com/in/imranh-dev1/

Portfolio:
https://imran-portfolio-iota.vercel.app/
