# 🔴 RedAxis

## Real-Time Blood Donation & Inventory Management Platform

## Deployed Link - https://redaxis-helix.netlify.app/

## 🩸 Problem Statement

India’s vast network of blood banks and hospitals often faces shortages not due to a lack of donors, but because of **poor coordination, outdated inventory tracking, and fragmented systems**. Critical blood availability data is frequently siloed or delayed, leading to **preventable loss of life**.

There is currently **no unified, real-time system** that connects **donors, hospitals, and NGOs** with accurate inventory visibility and fast discovery based on **location and urgency**.

---

## 💡 Proposed Solution

**RedAxis** is a **full-stack, real-time blood donation and inventory management platform** designed to bridge the coordination gap between donors, hospitals, and NGOs.

### The platform will:

* 🩸 Provide **real-time blood inventory visibility** across hospitals and blood banks
* 📍 Enable **location-based donor discovery** during emergencies
* 🤝 Allow NGOs to **coordinate donation drives and urgent requests**
* 🔐 Ensure **secure authentication and role-based access**
* 📊 Maintain **accurate and consistent data** using a centralized backend

### 🎯 Core Goal

> **No life should be lost due to missing, outdated, or inaccessible data.**

---

## 🚀 Project Overview

This repository contains the **Sprint-1 foundation setup** of the RedAxis web application.

While Sprint-1 focuses on **project initialization and structure**, the system is designed as a **full-stack application from the very beginning**.

The architecture is intentionally planned to support:

* Backend APIs
* Database integration
* Real-time updates
* Cloud deployment
* CI/CD pipelines

All future features will be built on top of this strong foundation.

---

## 🧠 Sprint Theme

### **Sprint 1 – Full-Stack Development with Next.js & AWS/Azure**

Sprint-1 establishes:

* A scalable frontend architecture
* A backend-ready project structure
* Clear separation of concerns
* Documentation that supports long-term development

---

## 🧰 Tech Stack

### 🎨 Frontend

* **Next.js (TypeScript)** – UI and routing
* **React** – Component-based UI

### ⚙️ Backend

* **Next.js API Routes** – Backend endpoints
* **Prisma** – ORM for database access

### 🗄️ Database & Caching

* **PostgreSQL** – Primary relational database
* **Redis** – Caching and fast lookups *(planned)*

### ☁️ Infrastructure & DevOps

* **Docker** – Containerization
* **AWS / Azure** – Cloud deployment
* **GitHub Actions** – CI/CD pipelines

---

## 🏗️ Folder Structure

```txt
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home route (/)
│   └── about/
│       └── page.tsx      # About route (/about)
│
├── components/
│   ├── ui/               # Reusable UI components
│   └── layout/           # Navbar, Footer, wrappers
│
├── lib/
│   ├── utils.ts          # Helper functions
│   ├── constants.ts      # App-wide constants
│   └── db.ts             # Database connection (planned)
│
├── api/                  # Backend logic (planned)
│
├── types/
│   └── index.ts          # Shared TypeScript types
```

---

## 📁 Folder Design Rationale

* **app/**
  Manages routing using the Next.js App Router

* **components/**
  Promotes UI reusability and consistent design

* **lib/**
  Centralizes utilities and backend configurations

* **api/**
  Dedicated space for backend business logic

* **types/**
  Ensures type safety across frontend and backend

* **styles/**
  Handles global styling

This structure ensures a **clean separation between UI, logic, and data layers**, making the application scalable, maintainable, and team-friendly.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

### 4️⃣ Access the Application

Open your browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 Sprint-1 Outcome

* Clean and scalable project structure
* Backend-ready architecture
* Strong documentation base
* Prepared foundation for future sprints

---

## Environment Variable Management

This project uses environment variables to securely manage configuration and secrets.

- `.env.local` is used for actual environment values and is ignored by Git.
- `.env.example` provides a template of required variables for setup.

### Variable Scope
- **Server-side only:** `DATABASE_URL`, `INTERNAL_API_SECRET`
- **Client-side safe:** `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_API_BASE_URL`

### Security
- Server-only variables are never used in client components.
- Only variables prefixed with `NEXT_PUBLIC_` are exposed.
- Sensitive files are protected using `.gitignore`.


## PostgreSQL Schema Design

This project uses PostgreSQL with Prisma ORM to design a normalized relational
database schema for the Blood Bank Management system.

### Core Entities
- **User** – Stores basic information about donors and hospitals
- **BloodInventory** – Tracks available blood units at hospitals
- **BloodRequest** – Represents blood requests made by users

### Relationships
- Each blood request is linked to a user using a foreign key
- Primary keys uniquely identify each record
- Unique constraints prevent duplicate user emails

### Normalization
- All fields contain atomic values (1NF)
- No partial dependencies exist (2NF)
- No transitive dependencies are present (3NF)

### Validation
The schema was validated using Prisma CLI and successfully applied to a
PostgreSQL database using Prisma Migrate.

----------

## Database Setup (Prisma + PostgreSQL)

This project uses **Prisma ORM** with **PostgreSQL** for schema management, migrations, and seed data.

### Schema Design
Core models include User, DonorProfile, Hospital, BloodInventory, and BloodRequest.  
Relations and constraints ensure data consistency and normalization.

### Prisma Setup
Prisma is initialized and configured with PostgreSQL.  
Prisma Client is used for type-safe database access across the app.

### Migrations
Schema changes are applied using Prisma migrations:

```bash
npx prisma migrate dev


--------

🔐 Authentication & Role-Based Access (NEW)

RedAxis now includes a complete authentication system with JWT-based security.

Implemented Features

User Signup (Donor / Hospital / NGO)

Secure Login with hashed passwords

JWT Token generation & verification

Logout functionality

/api/auth/me session validation

Role-Based Route Protection

Role Restrictions

/donor/* → DONOR only

/hospital/* → HOSPITAL only

Unauthenticated users → redirected to /login

🏥 Hospital Inventory Management (NEW)

Hospitals can now manage blood inventory.

Features

Add inventory

Update inventory

Delete inventory

View hospital-specific inventory

Expiry date tracking

Blood group filtering

API Endpoints

GET /api/inventory

POST /api/inventory

PUT /api/inventory/[id]

DELETE /api/inventory/[id]

🩸 Blood Request System (NEW)

Hospitals can create and manage blood requests with:

Urgency levels

Status tracking

Linked hospital ownership

🛡 Middleware Protection

Custom middleware now:

Verifies JWT

Injects user ID & role into headers

Blocks unauthorized access

Protects both API and dashboard routes

