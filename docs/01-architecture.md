# Apollonia Dental Practice – Application Architecture

## 1. Purpose

This document explains the application architecture of the Apollonia Dental Practice Employee Management System.

The system is designed as a full-stack web application with a clear separation between frontend, backend, and database responsibilities. The architecture is intentionally modular so the project can start as an employee management system and later grow into a broader clinic management or E-CRM platform.

---

## 2. Architecture Summary

The application follows a client-server architecture.

```text id="p69i0t"
Angular Frontend
       ↓
REST API over HTTP
       ↓
Node.js + Express Backend
       ↓
Prisma ORM
       ↓
PostgreSQL Database
```

Each layer has a specific responsibility:

| Layer    | Responsibility                                                                  |
| -------- | ------------------------------------------------------------------------------- |
| Frontend | User interface, forms, routing, dashboard, API calls                            |
| Backend  | Business logic, authentication, authorization, API handling                     |
| Database | Persistent storage for users, employees, departments, assignments, and patients |
| ORM      | Type-safe database access and schema management                                 |

---

## 3. Main Application Layers

### 3.1 Frontend Layer

The frontend is built with Angular.

It is responsible for:

- Displaying the login and signup page
- Displaying the protected dashboard
- Managing employee, department, assignment, and patient forms
- Calling backend APIs
- Storing the JWT token returned by the backend
- Sending authenticated requests through an HTTP interceptor
- Protecting dashboard access using route guards

The frontend does not contain backend secrets and does not directly access the database.

---

### 3.2 Backend Layer

The backend is built with Node.js, Express, and TypeScript.

It is responsible for:

- Handling REST API requests
- Creating and verifying JWT tokens
- Hashing and checking passwords
- Enforcing role-based access control
- Applying tenant-aware data access
- Running business logic
- Reading and writing data through Prisma
- Returning structured API responses to the frontend

The backend is the main security boundary of the system.

---

### 3.3 Database Layer

The database is PostgreSQL.

It stores:

- Tenants
- Users
- Employees
- Departments
- Employee-department assignments
- Patients
- Future CRM-related data such as revenue, training, and specialization records

PostgreSQL was chosen because the system contains structured business data with clear relationships.

---

### 3.4 ORM Layer

Prisma is used between the backend and PostgreSQL.

It provides:

- Type-safe database queries
- Database migrations
- Relational mapping
- Clear schema definition
- Easier future schema expansion

---

## 4. Frontend Architecture

The Angular application is organized into core, feature, and shared areas.

```text id="hu80ub"
src/app/
├── core
│   ├── api
│   ├── auth
│   ├── config
│   └── models
├── features
│   ├── auth
│   │   └── login
│   └── dashboard
│       ├── components
│       └── dashboard.ts
├── shared
│   └── styles
├── app.config.ts
├── app.routes.ts
├── app.ts
└── app.html
```

---

## 5. Frontend Module Responsibilities

### 5.1 Core

The `core` folder contains application-wide services and configuration.

| Folder        | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `core/api`    | Handles backend API calls                                    |
| `core/auth`   | Handles login, signup, token storage, guard, and interceptor |
| `core/config` | Stores frontend API configuration                            |
| `core/models` | Stores TypeScript interfaces used across the frontend        |

---

### 5.2 Features

The `features` folder contains user-facing application areas.

| Feature      | Purpose                                      |
| ------------ | -------------------------------------------- |
| `auth/login` | Login and signup screen                      |
| `dashboard`  | Main protected employee management dashboard |

The dashboard is further split into small components such as:

- Dashboard hero
- Department form
- Employee form
- Patient form
- Assignment manager
- Department-wise staff list
- Employee table
- Patient table

This keeps the dashboard easier to maintain and extend.

---

### 5.3 Shared

The `shared` folder contains reusable styling and common UI-related resources.

Current shared styles include:

- Card styles
- Form styles
- Table styles

---

## 6. Backend Architecture

The backend follows a modular Express architecture.

```text id="guod34"
src/
├── app.ts
├── server.ts
├── routes.ts
├── configs
│   ├── auth
│   ├── database
│   └── env.ts
├── middlewares
├── modules
├── utils
└── types
```

---

## 7. Backend File Responsibilities

| File/Folder        | Responsibility                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `server.ts`        | Starts the Express server                                                                              |
| `app.ts`           | Creates and configures the Express app                                                                 |
| `routes.ts`        | Registers all main API route groups                                                                    |
| `configs/env.ts`   | Loads and validates environment configuration                                                          |
| `configs/database` | Initializes Prisma/PostgreSQL connection                                                               |
| `configs/auth`     | Contains auth routes and auth controller                                                               |
| `middlewares`      | Handles auth, roles, tenant, CORS, errors, and 404 routes                                              |
| `modules`          | Contains feature APIs such as employees, departments, assignments, and patients                        |
| `utils`            | Contains reusable helpers such as password hashing, token handling, tenant lookup, and code generation |
| `types`            | Contains shared backend TypeScript types                                                               |

---

## 8. Backend Modules

### 8.1 Auth Module

Responsible for:

- Signup
- Login
- Current user lookup
- Protected dashboard metrics
- JWT creation
- JWT verification support

Routes include:

```text id="l5yihd"
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/dashboard
```

---

### 8.2 Employee Module

Responsible for:

- Creating employees
- Listing employees
- Returning employee department data

Routes include:

```text id="mdrsyy"
GET  /api/employees
POST /api/employees
GET  /api/employees/:employeeId/departments
```

---

### 8.3 Department Module

Responsible for:

- Creating departments
- Listing departments
- Returning employees in a department

Routes include:

```text id="jtib9e"
GET  /api/departments
POST /api/departments
GET  /api/departments/:departmentId/employees
```

---

### 8.4 Assignment Module

Responsible for:

- Assigning employees to departments
- Removing assignments
- Listing assignments
- Returning department-wise staff allocation

Routes include:

```text id="m6fbyp"
GET    /api/assignments
POST   /api/assignments
DELETE /api/assignments
GET    /api/assignments/by-department
```

---

### 8.5 Patient Module

Responsible for:

- Creating patient records
- Listing patients

Routes include:

```text id="kirgi3"
GET  /api/patients
POST /api/patients
```

---

## 9. Database Architecture

The database uses a relational structure.

Main entities:

```text id="ifsex0"
Tenant
User
Employee
Department
EmployeeDepartment
Patient
EmployeePatient
Revenue
Training
Specialization
```

The most important relationship in the current phase is:

```text id="0cinm4"
Employee many-to-many Department
```

This is handled using the `employee_departments` junction table.

---

## 10. Tenant-Aware Design

The application includes a tenant-aware foundation.

A tenant represents a clinic or organization. For this project, the default tenant is:

```text id="x8o6og"
apollonia
```

The frontend sends the tenant identifier in API requests:

```text id="ypstcs"
x-tenant-id: apollonia
```

The backend uses this tenant context to create and retrieve tenant-specific data.

This design allows the project to later support multiple clinics using the same application.

---

## 11. Authentication Architecture

The authentication flow works as follows:

```text id="z8r73a"
User submits signup/login form
        ↓
Angular sends request to backend auth API
        ↓
Backend validates user credentials
        ↓
Backend signs JWT using backend-only secret
        ↓
Frontend stores returned token
        ↓
Angular interceptor attaches token to protected requests
        ↓
Backend auth middleware verifies token
        ↓
Protected API route executes
```

The JWT secret is never exposed to the frontend.

---

## 12. Authorization Architecture

The system supports role-based access control.

Current roles:

| Role     | Description                                           |
| -------- | ----------------------------------------------------- |
| `ADMIN`  | Full access to dashboard and sensitive actions        |
| `STAFF`  | Operational access to create and manage basic records |
| `VIEWER` | Read-only role planned for future use                 |

Examples:

| Action                        | ADMIN | STAFF | VIEWER |
| ----------------------------- | ----: | ----: | -----: |
| View dashboard                |   Yes |   Yes |    Yes |
| Create employee               |   Yes |   Yes |     No |
| Create department             |   Yes |   Yes |     No |
| Assign employee to department |   Yes |   Yes |     No |
| Remove assignment             |   Yes |    No |     No |

---

## 13. Request Flow Example

### Creating an Employee

```text id="x02sxp"
Angular employee form
        ↓
POST /api/employees
        ↓
Auth interceptor adds JWT
        ↓
Backend auth middleware verifies token
        ↓
Role middleware checks ADMIN or STAFF
        ↓
Employee controller validates request
        ↓
Prisma creates employee record
        ↓
Optional department assignment is created
        ↓
Response returned to Angular
        ↓
Dashboard reloads data
```

---

## 14. Local Development Architecture

```text id="gsd584"
Browser
  ↓
Angular Dev Server
http://localhost:4200

Angular calls backend
  ↓
Express API
http://localhost:5000

Backend calls database
  ↓
PostgreSQL
localhost:5432
```

---

## 15. Deployment-Oriented Architecture

The system is prepared for a future deployment model like:

```text id="tav2em"
Frontend Hosting
        ↓
Backend API Service
        ↓
Managed PostgreSQL Database
```

Possible deployment targets:

- Render
- Railway
- AWS
- GCP
- Azure
- Docker-based VPS deployment

---

## 16. Why This Architecture Works

This architecture is suitable because:

- Frontend and backend are clearly separated
- Backend owns business logic and security
- PostgreSQL fits the relational nature of the data
- Prisma keeps database access type-safe
- Angular supports modular dashboard development
- The codebase can grow into patient, revenue, and CRM features
- Tenant-aware design prepares the system for SaaS expansion

---

## 17. Future Architectural Improvements

Planned improvements include:

- Docker Compose for full-stack local setup
- CI/CD pipeline
- API validation layer
- OpenAPI/Swagger documentation
- Refresh-token authentication
- Audit logging
- Role-aware frontend rendering
- Search and pagination
- Reporting dashboard
- Cloud deployment
- Monitoring and logging

---

## 18. Summary

The Apollonia Employee Management System uses a practical and scalable full-stack architecture.

It begins as a clinic employee and department management system, while keeping the structure ready for future E-CRM features such as patient assignments, revenue analytics, training records, and reporting dashboards.
