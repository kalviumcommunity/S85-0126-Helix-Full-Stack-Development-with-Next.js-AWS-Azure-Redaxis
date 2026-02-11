# 🔧 README.backend.md

# 🧠 RedAxis – Backend Architecture

This document explains how the backend of **RedAxis** works.

---

## 🏗 Backend Overview

RedAxis backend is built using:

- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Middleware-based Route Protection**
- **Redis (optional caching layer)**

The backend handles:

- Authentication
- Role-based authorization
- Inventory management
- Blood request handling
- Profile management

---

🔐 Authentication Flow
Signup

Validates input using Zod

Hashes password

Creates user record

Creates role-specific profile (Donor / Hospital)

Returns success response

Login

Validates credentials

Compares hashed password

Generates JWT token

Returns { user, token }

Token Usage

Token is sent in Authorization: Bearer <token>

Middleware verifies token

User ID & role injected via headers

🛡 Route Protection

Middleware protects:

/api/inventory

/api/requests

Role-based routes:

/donor/*

/hospital/*

/ngo/*

Security

Only hospitals can create/update/delete inventory

Validation using Zod schema

Prisma ensures relational integrity

🩺 Blood Requests

Hospitals can:

Create blood requests

Set urgency level

Track status

Request statuses:

PENDING

APPROVED

REJECTED

🗄 Database Models

Core models:

User

DonorProfile

Hospital

BloodInventory

BloodRequest

Relations are normalized (3NF compliant).

⚙ Prisma Setup
Generate Client
npx prisma generate
Run Migration
npx prisma migrate dev
Seed Data
npx prisma db seed
🚀 Backend Responsibilities Summary
Authentication & Authorization

Secure role-based routing

Inventory CRUD operations

Blood request handling

Data validation

Database integrity

Error handling standardization

🔄 Backend Evolution Plan
Upcoming improvements:

Refresh token system

Redis-based caching optimization

Rate limiting

Logging improvements

Request analytics

Production deployment hardening

🎯 Backend Goal
Ensure:

Secure access

Accurate medical inventory

Reliable data integrity

Scalable architecture

Production-ready structure


