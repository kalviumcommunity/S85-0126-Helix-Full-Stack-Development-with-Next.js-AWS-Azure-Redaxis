RedAxis – Local Development & Setup Guide
📦 Prerequisites

Ensure the following tools are installed:

Node.js (v18+ recommended)

npm

PostgreSQL

Docker (optional, for containerized setup)

Redis (if caching is enabled)

1️⃣ Clone Repository
git clone <repository-url>
cd <project-folder>

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file in the root directory.

Required Variables
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/redaxis_db"
JWT_SECRET="your_jwt_secret_here"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"

Notes

DATABASE_URL → PostgreSQL connection string

JWT_SECRET → Used for token signing and verification

REDIS_URL → Required only if Redis caching is enabled

NEXT_PUBLIC_* → Exposed to frontend

4️⃣ Database Setup (Prisma)
Generate Prisma Client
npx prisma generate

Run Migrations
npx prisma migrate dev

(Optional) Seed Database
npx prisma db seed

5️⃣ Run Development Server
npm run dev


Application will be available at:

http://localhost:3000

6️⃣ Docker Setup (Optional)
Build Image
docker build -t redaxis_app .

Run with Docker Compose
docker compose up

7️⃣ Common Issues & Fixes
Prisma Client Not Initialized
npx prisma generate

Connection Pool Timeout

Ensure PostgreSQL is running

Check DATABASE_URL

Restart development server

Redis ECONNREFUSED

Start Redis server

Or disable Redis integration in development

🔐 Authentication Flow (Local Testing)

Signup via /signup

Login via /login

JWT stored in cookie

Protected routes:

/donor/*

/hospital/*

/ngo/*

🧠 Recommended Dev Workflow
git checkout -b feature/your-feature
npm run dev


After changes:

git add .
git commit -m "feat: your feature"
git push origin feature/your-feature

🚀 Production Considerations

Use managed PostgreSQL (AWS RDS / Azure DB)

Store secrets in environment manager

Enable Redis for performance

Configure CI/CD pipeline

Use Docker for consistent builds