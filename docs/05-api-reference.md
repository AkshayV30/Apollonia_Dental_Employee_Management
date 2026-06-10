# Apollonia Dental Practice – Backend API Reference

## 1. Purpose

This document describes the backend REST API for the Apollonia Dental Practice Employee Management System.

The API supports:

- User signup and login
- JWT-based authentication
- Protected dashboard access
- Employee management
- Department management
- Employee-to-department assignments
- Patient management
- Role-based access control

---

## 2. Base URL

For local development:

```text
http://localhost:5000/api
```

Example:

```text
http://localhost:5000/api/employees
```

---

## 3. Common Headers

### Public Requests

Public endpoints such as signup and login require:

```http
Content-Type: application/json
x-tenant-id: apollonia
```

### Protected Requests

Protected endpoints require:

```http
Content-Type: application/json
x-tenant-id: apollonia
Authorization: Bearer <jwt-token>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
x-tenant-id: apollonia
```

---

## 4. Authentication Summary

The authentication flow works like this:

```text
Signup/Login
    ↓
Backend validates user
    ↓
Backend returns JWT token
    ↓
Frontend stores token
    ↓
Frontend sends token in Authorization header
    ↓
Backend verifies token for protected routes
```

The frontend does not know or store the JWT secret.

---

## 5. User Roles

The API supports the following roles:

| Role     | Description                                           |
| -------- | ----------------------------------------------------- |
| `ADMIN`  | Full access to manage records and remove assignments  |
| `STAFF`  | Operational access to create and manage basic records |
| `VIEWER` | Read-only access planned for future use               |

Current role behavior:

```text
First user in tenant  → ADMIN
Later users           → STAFF
```

---

## 6. Standard Error Responses

### Missing Token

```json
{
  "error": "No token provided"
}
```

### Invalid or Expired Token

```json
{
  "error": "Invalid or expired token"
}
```

### Invalid Login

```json
{
  "error": "Invalid email or password"
}
```

### Forbidden Access

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

### Route Not Found

```json
{
  "error": "Route not found",
  "path": "/api/unknown"
}
```

---

# Auth API

## 7. Signup

Creates a new user account.

The first user created for a tenant becomes `ADMIN`. Later users become `STAFF`.

```http
POST /api/auth/signup
```

### Access

Public

### Headers

```http
Content-Type: application/json
x-tenant-id: apollonia
```

### Request Body

```json
{
  "name": "Admin User",
  "email": "admin@apollonia.local",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "Signup successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "tenant_id": "tenant-id",
    "name": "Admin User",
    "email": "admin@apollonia.local",
    "role": "ADMIN",
    "status": "ACTIVE",
    "created_at": "2026-06-10T10:00:00.000Z",
    "updated_at": "2026-06-10T10:00:00.000Z"
  }
}
```

### Possible Errors

```json
{
  "error": "name, email and password are required"
}
```

```json
{
  "error": "Password must be at least 8 characters long"
}
```

```json
{
  "error": "User already exists for this tenant"
}
```

---

## 8. Login

Logs in an existing user and returns a JWT token.

```http
POST /api/auth/login
```

### Access

Public

### Headers

```http
Content-Type: application/json
x-tenant-id: apollonia
```

### Request Body

```json
{
  "email": "admin@apollonia.local",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "tenant_id": "tenant-id",
    "name": "Admin User",
    "email": "admin@apollonia.local",
    "role": "ADMIN",
    "status": "ACTIVE",
    "created_at": "2026-06-10T10:00:00.000Z",
    "updated_at": "2026-06-10T10:00:00.000Z"
  }
}
```

### Possible Errors

```json
{
  "error": "email and password are required"
}
```

```json
{
  "error": "Invalid email or password"
}
```

```json
{
  "error": "User account is disabled"
}
```

---

## 9. Current User

Returns the currently authenticated user.

```http
GET /api/auth/me
```

### Access

Authenticated users

### Headers

```http
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Success Response

```json
{
  "user": {
    "id": "user-id",
    "tenant_id": "tenant-id",
    "name": "Admin User",
    "email": "admin@apollonia.local",
    "role": "ADMIN",
    "status": "ACTIVE",
    "created_at": "2026-06-10T10:00:00.000Z",
    "updated_at": "2026-06-10T10:00:00.000Z"
  }
}
```

---

## 10. Dashboard Metrics

Returns protected dashboard data and summary metrics.

```http
GET /api/auth/dashboard
```

### Access

Authenticated users

### Headers

```http
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Success Response

```json
{
  "message": "Dashboard access granted",
  "user": {
    "id": "user-id",
    "tenantId": "tenant-id",
    "tenantSlug": "apollonia",
    "name": "Admin User",
    "email": "admin@apollonia.local",
    "role": "ADMIN"
  },
  "metrics": {
    "employees": 10,
    "departments": 5,
    "patients": 0,
    "assignments": 11
  }
}
```

---

# Employee API

## 11. Get All Employees

Returns all employees for the current tenant.

```http
GET /api/employees
```

### Access

Authenticated users

### Headers

```http
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Success Response

```json
[
  {
    "id": "employee-id",
    "employee_id": "EMP001",
    "first_name": "Lisa",
    "last_name": "Harris",
    "date_of_joining": "2020-04-15T00:00:00.000Z",
    "specialization": "Restorative Dentistry",
    "years_of_experience": 4,
    "background_info": "Specialist in dental implants and cosmetic orthodontics.",
    "departments": [
      {
        "id": "department-id",
        "department_id": "DEP003",
        "name": "Restorative Dentistry"
      }
    ]
  }
]
```

---

## 12. Create Employee

Creates a new employee.

If `department_id` is provided, the employee is also assigned to that department.

```http
POST /api/employees
```

### Access

`ADMIN`, `STAFF`

### Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Request Body

```json
{
  "first_name": "New",
  "last_name": "Doctor",
  "department_id": "DEP001",
  "date_of_joining": "2024-01-10",
  "specialization": "General Dentistry",
  "years_of_experience": 2,
  "background_info": "Newly added doctor."
}
```

### Success Response

```json
{
  "id": "employee-id",
  "employee_id": "EMP011",
  "first_name": "New",
  "last_name": "Doctor",
  "date_of_joining": "2024-01-10T00:00:00.000Z",
  "specialization": "General Dentistry",
  "years_of_experience": 2,
  "background_info": "Newly added doctor."
}
```

### Possible Errors

```json
{
  "error": "first_name and last_name are required"
}
```

```json
{
  "error": "Department not found",
  "department_id": "DEP999"
}
```

---

## 13. Get Departments for Employee

Returns departments linked to one employee.

```http
GET /api/employees/:employeeId/departments
```

### Example

```http
GET /api/employees/EMP001/departments
```

### Access

Authenticated users

### Success Response

```json
[
  {
    "id": "department-id",
    "department_id": "DEP003",
    "name": "Restorative Dentistry"
  },
  {
    "id": "department-id",
    "department_id": "DEP005",
    "name": "Orthodontics"
  }
]
```

---

# Department API

## 14. Get All Departments

Returns all departments for the current tenant.

```http
GET /api/departments
```

### Access

Authenticated users

### Success Response

```json
[
  {
    "id": "department-id",
    "department_id": "DEP001",
    "name": "General Dentistry"
  },
  {
    "id": "department-id",
    "department_id": "DEP002",
    "name": "Pediatric Dentistry"
  }
]
```

---

## 15. Create Department

Creates a new department.

```http
POST /api/departments
```

### Access

`ADMIN`, `STAFF`

### Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Request Body

```json
{
  "name": "Implant Dentistry"
}
```

### Success Response

```json
{
  "id": "department-id",
  "department_id": "DEP006",
  "name": "Implant Dentistry"
}
```

### Possible Errors

```json
{
  "error": "Department name is required"
}
```

---

## 16. Get Employees in Department

Returns employees assigned to one department.

```http
GET /api/departments/:departmentId/employees
```

### Example

```http
GET /api/departments/DEP001/employees
```

### Access

Authenticated users

### Success Response

```json
[
  {
    "id": "employee-id",
    "employee_id": "EMP002",
    "first_name": "Alfred",
    "last_name": "Christensen",
    "specialization": "General Dentistry",
    "years_of_experience": 6,
    "background_info": "Experienced in routine dental checkups and preventive care."
  }
]
```

---

# Assignment API

## 17. Get All Assignments

Returns all employee-department assignments.

```http
GET /api/assignments
```

### Access

Authenticated users

### Success Response

```json
[
  {
    "employee_id": "EMP001",
    "employee_name": "Lisa Harris",
    "department_id": "DEP003",
    "department_name": "Restorative Dentistry",
    "assigned_at": "2026-06-10T10:00:00.000Z"
  }
]
```

---

## 18. Create Assignment

Assigns an employee to a department.

```http
POST /api/assignments
```

### Access

`ADMIN`, `STAFF`

### Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Request Body

```json
{
  "employee_id": "EMP001",
  "department_id": "DEP001"
}
```

### Success Response

```json
{
  "employeeId": "employee-internal-id",
  "departmentId": "department-internal-id",
  "assignedAt": "2026-06-10T10:00:00.000Z"
}
```

### Possible Errors

```json
{
  "error": "employee_id and department_id are required"
}
```

```json
{
  "error": "Employee not found",
  "employee_id": "EMP999"
}
```

```json
{
  "error": "Department not found",
  "department_id": "DEP999"
}
```

---

## 19. Delete Assignment

Removes an employee-department assignment.

```http
DELETE /api/assignments
```

### Access

`ADMIN`

### Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Request Body

```json
{
  "employee_id": "EMP001",
  "department_id": "DEP001"
}
```

### Success Response

```json
{
  "message": "Assignment removed",
  "employee_id": "EMP001",
  "department_id": "DEP001"
}
```

### Possible Errors

```json
{
  "error": "employee_id and department_id are required"
}
```

```json
{
  "error": "Employee or department not found"
}
```

```json
{
  "error": "Forbidden: insufficient permissions"
}
```

---

## 20. Department-Wise Employees

Returns departments with assigned employees.

```http
GET /api/assignments/by-department
```

### Access

Authenticated users

### Success Response

```json
[
  {
    "id": "department-id",
    "department_id": "DEP001",
    "name": "General Dentistry",
    "employees": [
      {
        "id": "employee-id",
        "employee_id": "EMP002",
        "first_name": "Alfred",
        "last_name": "Christensen",
        "specialization": "General Dentistry",
        "years_of_experience": 6,
        "background_info": "Experienced in routine dental checkups and preventive care."
      }
    ]
  }
]
```

---

# Patient API

## 21. Get All Patients

Returns all patients for the current tenant.

```http
GET /api/patients
```

### Access

Authenticated users

### Success Response

```json
[
  {
    "id": "patient-id",
    "patient_id": "PAT001",
    "patient_name": "Patient Name",
    "patient_image": "https://example.com/patient.jpg",
    "treatment_notes": "Initial consultation completed."
  }
]
```

---

## 22. Create Patient

Creates a new patient record.

```http
POST /api/patients
```

### Access

`ADMIN`, `STAFF`

### Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

### Request Body

```json
{
  "patient_name": "Patient Name",
  "patient_image": "https://example.com/patient.jpg",
  "treatment_notes": "Initial consultation completed."
}
```

### Success Response

```json
{
  "id": "patient-id",
  "patient_id": "PAT001",
  "patient_name": "Patient Name",
  "patient_image": "https://example.com/patient.jpg",
  "treatment_notes": "Initial consultation completed."
}
```

### Possible Errors

```json
{
  "error": "patient_name is required"
}
```

---

# Health and Root API

## 23. Root Route

Checks whether the backend API is running.

```http
GET /
```

### Success Response

```json
{
  "message": "Apollonia Employee Management API running",
  "database": "PostgreSQL",
  "orm": "Prisma",
  "module": "ESM"
}
```

---

## 24. Health Check

Checks the API health status.

```http
GET /health
```

### Success Response

```json
{
  "status": "ok",
  "database": "postgres",
  "orm": "prisma",
  "module": "esm",
  "timestamp": "2026-06-10T10:00:00.000Z"
}
```

---

# Example Testing Flow

## 25. Signup Admin

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: apollonia" \
  -d '{
    "name": "Admin User",
    "email": "admin@apollonia.local",
    "password": "password123"
  }'
```

---

## 26. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: apollonia" \
  -d '{
    "email": "admin@apollonia.local",
    "password": "password123"
  }'
```

Copy the token from the response.

---

## 27. Access Protected API

```bash
curl http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-tenant-id: apollonia"
```

---

## 28. Create Department

```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-tenant-id: apollonia" \
  -d '{
    "name": "Implant Dentistry"
  }'
```

---

## 29. Create Employee

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-tenant-id: apollonia" \
  -d '{
    "first_name": "New",
    "last_name": "Doctor",
    "department_id": "DEP001",
    "specialization": "General Dentistry",
    "years_of_experience": 2,
    "background_info": "Newly added doctor."
  }'
```

---

## 30. Assign Employee to Department

```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-tenant-id: apollonia" \
  -d '{
    "employee_id": "EMP001",
    "department_id": "DEP001"
  }'
```

---

## 31. Summary

This API provides the backend foundation for the Apollonia Dental Practice Employee Management System.

It supports secure user authentication, role-based access control, employee and department management, staff assignment workflows, patient records, and dashboard data access.

The API is structured to support the current application and future clinic management or E-CRM expansion.
