# Apollonia Dental Practice – System Design and Workflows

## 1. Purpose

This document explains the system design and main workflows of the Apollonia Dental Practice Employee Management System.

The system is designed to support the clinic’s current employee and department management needs while keeping the foundation ready for future clinic management and E-CRM features.

The current design focuses on:

- User signup and login
- Secure dashboard access
- Employee management
- Department management
- Employee-to-department assignment
- Patient record foundation
- Role-based access
- Tenant-aware data handling

---

## 2. System Summary

The application is a full-stack web system with three main parts:

```text
Angular Frontend
        ↓
Node.js + Express Backend
        ↓
PostgreSQL Database
```

The frontend provides the user interface.
The backend handles business rules, authentication, authorization, and API responses.
The database stores users, employees, departments, assignments, and patients.

---

## 3. Main Users

The system currently supports the following user types:

| User Type | Description                                           |
| --------- | ----------------------------------------------------- |
| Admin     | Main clinic administrator with wider access           |
| Staff     | Operational user who can manage common clinic records |
| Viewer    | Planned future read-only role                         |

---

## 4. Role-Based Access Summary

| Action                        | Admin | Staff | Viewer |
| ----------------------------- | ----: | ----: | -----: |
| Signup/Login                  |   Yes |   Yes |    Yes |
| View dashboard                |   Yes |   Yes |    Yes |
| View employees                |   Yes |   Yes |    Yes |
| Create employee               |   Yes |   Yes |     No |
| View departments              |   Yes |   Yes |    Yes |
| Create department             |   Yes |   Yes |     No |
| Assign employee to department |   Yes |   Yes |     No |
| Remove employee assignment    |   Yes |    No |     No |
| View patients                 |   Yes |   Yes |    Yes |
| Create patient                |   Yes |   Yes |     No |

The first user created for the clinic becomes an admin. Later users become staff users.

---

## 5. Core System Components

### 5.1 Frontend

The Angular frontend is responsible for:

- Login and signup screens
- Dashboard UI
- Forms for employees, departments, patients, and assignments
- Displaying employee and patient tables
- Displaying department-wise staff allocation
- Storing the JWT token returned by the backend
- Sending protected API requests

---

### 5.2 Backend

The Node.js and Express backend is responsible for:

- Handling API requests
- Creating users
- Logging users in
- Hashing passwords
- Signing JWT tokens
- Verifying JWT tokens
- Enforcing role-based access
- Managing tenant context
- Reading and writing data through Prisma
- Returning structured responses to Angular

---

### 5.3 Database

PostgreSQL stores the application data.

Main data areas include:

- Tenants
- Users
- Employees
- Departments
- Employee-department assignments
- Patients
- Future revenue, training, and specialization records

---

## 6. High-Level Request Flow

```text
User interacts with Angular UI
        ↓
Angular sends request to backend API
        ↓
Backend validates authentication and role
        ↓
Backend processes business logic
        ↓
Prisma reads/writes PostgreSQL data
        ↓
Backend sends response to Angular
        ↓
Angular updates the dashboard
```

---

## 7. Authentication Workflow

### 7.1 Signup Workflow

```text
User opens signup page
        ↓
User enters name, email, and password
        ↓
Angular sends POST /api/auth/signup
        ↓
Backend identifies tenant
        ↓
Backend checks if user already exists
        ↓
Backend hashes password
        ↓
Backend creates user
        ↓
Backend assigns role
        ↓
Backend signs JWT token
        ↓
Frontend stores token and user
        ↓
User is redirected to dashboard
```

### Signup Role Rule

```text
First user in tenant  → ADMIN
Later users           → STAFF
```

---

### 7.2 Login Workflow

```text
User opens login page
        ↓
User enters email and password
        ↓
Angular sends POST /api/auth/login
        ↓
Backend finds user by tenant and email
        ↓
Backend verifies password
        ↓
Backend checks user status
        ↓
Backend signs JWT token
        ↓
Frontend stores token and user
        ↓
User is redirected to dashboard
```

---

### 7.3 Logout Workflow

```text
User clicks logout
        ↓
Frontend removes token from local storage
        ↓
Frontend removes stored user data
        ↓
User is redirected to login page
```

---

## 8. Dashboard Access Workflow

```text
User opens dashboard route
        ↓
Angular auth guard checks token
        ↓
If token exists, dashboard route opens
        ↓
Angular loads dashboard data
        ↓
Auth interceptor attaches JWT token
        ↓
Backend verifies token
        ↓
Backend returns protected data
```

If the user is not logged in, Angular redirects to:

```text
/login
```

---

## 9. Employee Management Workflow

### 9.1 Create Employee

```text
User fills employee form
        ↓
Angular sends POST /api/employees
        ↓
Backend verifies JWT
        ↓
Backend checks role: ADMIN or STAFF
        ↓
Backend creates employee record
        ↓
If department is selected, backend creates assignment
        ↓
Dashboard reloads employee and department data
```

### 9.2 View Employees

```text
User opens dashboard
        ↓
Angular sends GET /api/employees
        ↓
Backend verifies JWT
        ↓
Backend returns employee list with department details
        ↓
Angular displays employee table
```

---

## 10. Department Management Workflow

### 10.1 Create Department

```text
User fills department form
        ↓
Angular sends POST /api/departments
        ↓
Backend verifies JWT
        ↓
Backend checks role: ADMIN or STAFF
        ↓
Backend creates department record
        ↓
Dashboard reloads department data
```

### 10.2 View Departments

```text
Dashboard loads
        ↓
Angular sends GET /api/departments
        ↓
Backend verifies JWT
        ↓
Backend returns department list
        ↓
Angular updates department dropdowns and views
```

---

## 11. Assignment Workflow

Employees can belong to more than one department. This is handled through an employee-department assignment.

### 11.1 Create Assignment

```text
User selects employee and department
        ↓
Angular sends POST /api/assignments
        ↓
Backend verifies JWT
        ↓
Backend checks role: ADMIN or STAFF
        ↓
Backend validates employee exists
        ↓
Backend validates department exists
        ↓
Backend creates employee-department assignment
        ↓
Dashboard reloads assignment and department-wise staff data
```

---

### 11.2 Remove Assignment

```text
Admin clicks remove assignment
        ↓
Angular sends DELETE /api/assignments
        ↓
Backend verifies JWT
        ↓
Backend checks role: ADMIN
        ↓
Backend removes employee-department assignment
        ↓
Dashboard reloads assignment and department-wise staff data
```

Only admin users can remove assignments.

---

### 11.3 Department-Wise Staff View

```text
Dashboard loads
        ↓
Angular sends GET /api/assignments/by-department
        ↓
Backend verifies JWT
        ↓
Backend retrieves departments with assigned employees
        ↓
Angular displays department-wise staff cards
```

---

## 12. Patient Management Workflow

### 12.1 Create Patient

```text
User fills patient form
        ↓
Angular sends POST /api/patients
        ↓
Backend verifies JWT
        ↓
Backend checks role: ADMIN or STAFF
        ↓
Backend creates patient record
        ↓
Dashboard reloads patient list
```

---

### 12.2 View Patients

```text
Dashboard loads
        ↓
Angular sends GET /api/patients
        ↓
Backend verifies JWT
        ↓
Backend returns patient list
        ↓
Angular displays patient table
```

---

## 13. Tenant Workflow

The system includes a tenant-aware foundation.

For this project, the default tenant is:

```text
apollonia
```

Frontend sends the tenant identifier with API requests:

```text
x-tenant-id: apollonia
```

Backend uses this tenant value to scope users and records.

Current tenant flow:

```text
Frontend sends x-tenant-id
        ↓
Backend reads tenant slug
        ↓
Backend finds or creates tenant
        ↓
Backend uses tenant ID in database queries
```

This prepares the system for future multi-clinic SaaS support.

---

## 14. Data Relationships

The current system is built around these relationships:

```text
Tenant has many Users
Tenant has many Employees
Tenant has many Departments
Tenant has many Patients

Employee can belong to many Departments
Department can have many Employees
```

The employee-department relationship is many-to-many.

It is handled through:

```text
employee_departments
```

---

## 15. Main API Workflows

### Public APIs

These routes do not require an existing token:

```text
POST /api/auth/signup
POST /api/auth/login
```

### Protected APIs

These routes require a valid JWT token:

```text
GET /api/auth/me
GET /api/auth/dashboard
GET /api/employees
GET /api/departments
GET /api/assignments
GET /api/assignments/by-department
GET /api/patients
```

### Role-Protected Write APIs

These routes require specific user roles:

```text
POST /api/employees       → ADMIN, STAFF
POST /api/departments     → ADMIN, STAFF
POST /api/assignments     → ADMIN, STAFF
DELETE /api/assignments   → ADMIN
POST /api/patients        → ADMIN, STAFF
```

---

## 16. Error Handling Design

The backend returns clear error responses for common cases.

Examples:

### Missing Token

```json
{
  "error": "No token provided"
}
```

### Invalid Token

```json
{
  "error": "Invalid or expired token"
}
```

### Insufficient Permission

```json
{
  "error": "Forbidden: insufficient permissions"
}
```

### Duplicate Record

```json
{
  "error": "Duplicate record"
}
```

---

## 17. Frontend State Flow

The Angular dashboard keeps track of:

- Employees
- Departments
- Patients
- Assignments
- Department-wise employees
- Loading state
- Error messages
- Current logged-in user

When a create/update action succeeds, the dashboard reloads data from the backend to keep the UI fresh.

---

## 18. Security Design

Current security design includes:

- Password hashing
- JWT token authentication
- Protected routes
- Role-based access checks
- Tenant-aware data access
- Backend-only JWT secret
- Frontend token storage

The frontend never stores the JWT secret. It only stores the token returned by the backend.

---

## 19. Current Design Limitations

The current system is suitable for a learning and portfolio project, but some production improvements are still planned.

Current limitations:

- JWT is stored in browser local storage
- Staff signup is open after first admin
- No password reset
- No email verification
- No audit logs
- No API rate limiting
- No pagination yet
- No advanced validation layer yet

---

## 20. Future System Improvements

Future versions can improve the system with:

- Admin-created staff invitations
- Password reset workflow
- Refresh-token authentication
- HTTP-only cookie option
- Audit logs
- Search and pagination
- Advanced reporting dashboard
- Patient-to-employee assignment
- Training and specialization workflows
- Revenue analytics
- Docker deployment
- Cloud deployment
- CI/CD pipeline

---

## 21. Summary

The system is designed as a practical and expandable clinic management platform.

It currently solves the core requirement of managing employees, departments, assignments, patients, and secure dashboard access. At the same time, the system structure keeps the project ready for future E-CRM features such as revenue tracking, patient assignments, training records, and reporting.
