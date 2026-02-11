# 🖥 Frontend Documentation

This document explains how the frontend of the RedAxis works, including routing, authentication flow, role-based dashboards, protected routes, inventory UI, and API interaction.

---

## 1️⃣ Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- JWT-based authentication
- Role-based route handling
- REST API integration

---

## 2️⃣ Routing Structure

The application follows a role-based route architecture.

### Public Routes

- `/`
- `/login`
- `/signup`
- `/contact`

### Role-Based Routes

- `/donor`
- `/hospital`
- `/ngo`
- `/profile`

### API Routes (Consumed by Frontend)

- `/api/auth/login`
- `/api/auth/signup`
- `/api/auth/me`
- `/api/inventory`
- `/api/requests`

---

## 3️⃣ Authentication Flow (Frontend)

### Login Flow

1. User enters email and password.
2. Frontend sends POST request to `/api/auth/login`.
3. Backend returns:
   - JWT token
   - User object
4. Token is stored.
5. Frontend redirects based on role:
   - DONOR → `/donor`
   - HOSPITAL → `/hospital`
   - NGO → `/ngo`

---

### Signup Flow

1. User submits registration form.
2. POST request sent to `/api/auth/signup`.
3. Backend creates user.
4. Frontend redirects user accordingly.

---

### Session Validation

On page load:

- Frontend calls `/api/auth/me`
- If token is valid → user state is set
- If invalid → redirect to `/login`

---

## 4️⃣ Role-Based Dashboard UI

Each role has a separate dashboard.

### Donor Dashboard

- View blood availability
- View requests
- Read-only inventory access
- Profile overview

### Hospital Dashboard

- Create blood inventory
- Update inventory
- Delete inventory
- Create blood requests
- View stock table

### NGO Dashboard

- View blood requests
- Monitor availability
- No inventory modification access

---

## 5️⃣ Protected Routes Logic

Frontend protection ensures:

- Unauthenticated users → redirected to `/login`
- DONOR cannot access `/hospital`
- HOSPITAL cannot access `/donor`
- NGO cannot access other role routes

Protection layers:

1. Frontend route checks
2. Middleware validation
3. Backend role enforcement

---

## 6️⃣ Inventory UI (Hospital Only)

Hospital users can:

- Add inventory
  - Blood group
  - Units
  - Expiry date
- Edit inventory
- Delete inventory
- View inventory table

### API Usage

- GET `/api/inventory`
- POST `/api/inventory`
- PUT `/api/inventory/[id]`
- DELETE `/api/inventory/[id]`

UI includes:

- Form validation
- Toast notifications
- Table rendering
- Role-based conditional rendering

---

## 7️⃣ Contact Page

Route: `/contact`

Features:

- Static contact form UI
- Responsive layout
- Clean Tailwind styling

Currently frontend-only (no backend integration yet).

---

## 8️⃣ Navbar Logic

Navbar dynamically changes based on authentication state.

### If Not Logged In

- Home
- Login
- Signup
- Contact

### If Logged In

- Dashboard (role-based)
- Profile
- Logout

Navbar determines role using `/api/auth/me`.

---

## 9️⃣ State Management Approach

- React hooks (useState, useEffect)
- Auth state fetched from backend
- Role stored in component state
- No external global state library

### Future Improvement

- Centralized Auth Context
- React Query / SWR
- Better loading and error handling

---

## 🔟 API Calling Structure

Frontend communicates using REST APIs.

Pattern used:

- Fetch API
- Authorization header with Bearer token
- try/catch error handling
- Redirect on 401/403

HTTP Methods:

- GET → fetch data
- POST → create data
- PUT → update data
- DELETE → remove data

All protected endpoints require valid JWT.

---

## 1️⃣1️⃣ Middleware Interaction

Frontend relies on middleware for:

- API protection
- Token validation
- Role enforcement

Frontend handles UI redirects.
Backend handles strict authorization.

---

## 1️⃣2️⃣ Implemented Features

- Login / Signup UI
- Role-based dashboards
- Profile page
- Inventory CRUD UI
- Blood request UI
- Dynamic navbar
- Contact page
- Route protection
- JWT authentication
- Docker-ready frontend

---

## 1️⃣3️⃣ Future Improvements

- Global auth context
- Loading skeletons
- Error boundaries
- Analytics charts
- Notification system
- Pagination
- Improved responsiveness

---

## Summary

The frontend implements:

- Secure authentication
- Role-based access control
- Inventory management UI
- Request creation UI
- Protected routing
- API-driven dynamic rendering

The architecture maintains clean separation between UI logic and backend validation while ensuring proper role enforcement.
