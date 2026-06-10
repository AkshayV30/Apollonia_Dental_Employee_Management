# Apollonia Dental Practice – Authentication and Security

## 1. Purpose

This document explains the authentication and security design used in the Apollonia Dental Practice Employee Management System.

The system includes user signup, login, JWT-based authentication, protected dashboard access, tenant-aware requests, and role-based authorization for admin and staff users.

The goal is to provide a secure foundation for the current employee management system while keeping the design ready for future production-level improvements.

---

## 2. Security Overview

The application uses the following security mechanisms:

- User signup and login
- Password hashing
- JWT-based authentication
- Protected API routes
- Role-based access control
- Tenant-aware request handling
- Frontend route protection
- Backend middleware protection
- Backend-only secret management

The frontend never stores or exposes backend secrets. It only stores the token returned by the backend after successful login or signup.

---

## 3. Authentication Flow

Authentication verifies who the user is.

The system supports two main authentication actions:

```text
Signup
Login
```

Both actions return a JWT token when successful.

---

## 4. Signup Flow

The signup process creates a new user account.

```text
User fills signup form
        ↓
Frontend sends name, email, and password
        ↓
Backend reads tenant identifier
        ↓
Backend checks if user already exists
        ↓
Backend hashes password
        ↓
Backend creates user record
        ↓
Backend assigns user role
        ↓
Backend signs JWT token
        ↓
Frontend stores token and user data
        ↓
User is redirected to dashboard
```

---

## 5. Signup Role Rule

The current role assignment rule is:

```text
First user in tenant  → ADMIN
Later users           → STAFF
```

This means the first user created for Apollonia Dental Practice becomes the administrator.

Example first signup:

```text
Name: Admin User
Email: admin@apollonia.local
Password: password123
Role: ADMIN
```

Example later signup:

```text
Name: Staff User
Email: staff@apollonia.local
Password: password123
Role: STAFF
```

---

## 6. Login Flow

The login process verifies an existing user.

```text
User fills login form
        ↓
Frontend sends email and password
        ↓
Backend reads tenant identifier
        ↓
Backend finds user by tenant and email
        ↓
Backend compares password with stored password hash
        ↓
Backend checks user status
        ↓
Backend signs JWT token
        ↓
Frontend stores token and user data
        ↓
User is redirected to dashboard
```

If the email or password is incorrect, the backend returns an authentication error.

---

## 7. Logout Flow

Logout is handled on the frontend.

```text
User clicks logout
        ↓
Frontend removes JWT token from local storage
        ↓
Frontend removes stored user data
        ↓
User is redirected to login page
```

The next protected request will fail unless the user logs in again.

---

## 8. Password Security

Passwords are never stored directly in the database.

The backend stores only the hashed password.

```text
Plain password
        ↓
Hashing function
        ↓
Stored password_hash
```

Example database field:

```text
password_hash
```

During login, the backend compares the submitted password with the stored hash.

The system uses password hashing so that even if database records are viewed, the original password is not directly available.

---

## 9. JWT Authentication

After signup or login, the backend creates a JWT token.

The token contains safe user information such as:

```json
{
  "id": "user-id",
  "tenantId": "tenant-id",
  "tenantSlug": "apollonia",
  "name": "Admin User",
  "email": "admin@apollonia.local",
  "role": "ADMIN"
}
```

The token is signed using the backend-only secret:

```env
JWT_SECRET=...
```

The JWT secret must never be placed inside Angular or any frontend code.

---

## 10. Frontend Token Storage

The frontend stores the returned token using a configured browser storage key.

Example frontend config:

```ts
export const API_CONFIG = {
  baseUrl: "http://localhost:5000/api",
  tenantId: "apollonia",
  tokenKey: "apollonia_auth_token",
  userKey: "apollonia_auth_user",
} as const;
```

Important distinction:

```text
tokenKey   → browser storage key name
JWT_SECRET → backend-only signing secret
```

The frontend stores:

```text
apollonia_auth_token
apollonia_auth_user
```

The frontend does not store:

```text
JWT_SECRET
DATABASE_URL
PASSWORD_SALT_ROUNDS
```

---

## 11. Auth Interceptor

The Angular frontend uses an HTTP interceptor to attach authentication details to every backend request.

The interceptor adds:

```http
Authorization: Bearer <jwt-token>
x-tenant-id: apollonia
```

This allows the backend to:

- Identify the logged-in user
- Verify the token
- Read the tenant context
- Protect API routes

---

## 12. Backend Auth Middleware

The backend uses authentication middleware to protect private routes.

The middleware:

1. Reads the `Authorization` header.
2. Checks for a Bearer token.
3. Verifies the token using `JWT_SECRET`.
4. Extracts the authenticated user.
5. Adds user information to the request.
6. Allows the request to continue.

If the token is missing, invalid, or expired, the request is rejected.

Example error:

```json
{
  "error": "Invalid or expired token"
}
```

---

## 13. Role-Based Access Control

Authorization decides what an authenticated user is allowed to do.

The system currently supports these roles:

| Role     | Description                           |
| -------- | ------------------------------------- |
| `ADMIN`  | Full management access                |
| `STAFF`  | Operational access                    |
| `VIEWER` | Read-only role planned for future use |

---

## 14. Permission Matrix

| Action                        | ADMIN | STAFF | VIEWER |
| ----------------------------- | ----: | ----: | -----: |
| View dashboard                |   Yes |   Yes |    Yes |
| View employees                |   Yes |   Yes |    Yes |
| Create employee               |   Yes |   Yes |     No |
| View departments              |   Yes |   Yes |    Yes |
| Create department             |   Yes |   Yes |     No |
| Assign employee to department |   Yes |   Yes |     No |
| Remove employee assignment    |   Yes |    No |     No |
| View patients                 |   Yes |   Yes |    Yes |
| Create patient                |   Yes |   Yes |     No |

---

## 15. Public Routes

The following routes are public:

```text
POST /api/auth/signup
POST /api/auth/login
```

These routes do not require an existing token.

---

## 16. Protected Routes

The following routes require a valid JWT token:

```text
GET /api/auth/me
GET /api/auth/dashboard
GET /api/employees
GET /api/departments
GET /api/assignments
GET /api/assignments/by-department
GET /api/patients
```

---

## 17. Role-Protected Routes

Some routes require both authentication and specific roles.

```text
POST   /api/employees       → ADMIN, STAFF
POST   /api/departments     → ADMIN, STAFF
POST   /api/patients        → ADMIN, STAFF
POST   /api/assignments     → ADMIN, STAFF
DELETE /api/assignments     → ADMIN
```

This prevents regular staff users from performing more sensitive operations such as removing assignments.

---

## 18. Tenant-Aware Security

The system includes tenant-aware access.

For this project, the default tenant is:

```text
apollonia
```

The frontend sends:

```http
x-tenant-id: apollonia
```

The backend uses this to scope users and records to the correct tenant.

Current tenant behavior:

```text
Request includes x-tenant-id
        ↓
Backend finds or creates tenant
        ↓
Backend uses tenant ID for user and data queries
```

This prepares the system for future multi-clinic SaaS support.

---

## 19. Security Boundary

The backend is the main security boundary.

The frontend is responsible for:

- Showing login/signup UI
- Storing the returned token
- Attaching the token to requests
- Redirecting unauthenticated users

The backend is responsible for:

- Hashing passwords
- Verifying passwords
- Signing JWT tokens
- Verifying JWT tokens
- Enforcing roles
- Protecting database access
- Returning safe user data only

---

## 20. Safe User Response

The backend returns safe user information after login or signup.

Example:

```json
{
  "id": "user-id",
  "tenant_id": "tenant-id",
  "name": "Admin User",
  "email": "admin@apollonia.local",
  "role": "ADMIN",
  "status": "ACTIVE"
}
```

The backend never returns:

```text
password_hash
JWT_SECRET
DATABASE_URL
```

---

## 21. Environment Security

Backend secrets are stored in the backend `.env` file.

Example:

```env
JWT_SECRET=replace_with_secure_secret
JWT_ACCESS_EXPIRES_IN=1h
PASSWORD_SALT_ROUNDS=12
```

Rules:

- Do not commit `.env`
- Do not expose secrets to Angular
- Generate strong secrets using a secure method
- Replace any secret that has been shared publicly

---

## 22. Common Error Responses

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

### Insufficient Permission

```json
{
  "error": "Forbidden: insufficient permissions"
}
```

### Duplicate User

```json
{
  "error": "User already exists for this tenant"
}
```

---

## 23. Current Security Limitations

The current security design is suitable for a portfolio and learning project, but it is not the final production-level security model.

Current limitations:

- JWT is stored in browser local storage
- Signup is open after first admin
- No email verification
- No password reset
- No refresh token flow
- No audit logs
- No login rate limiting
- No account lockout
- No full permission table yet

---

## 24. Recommended Production Improvements

Future production improvements should include:

- HTTP-only secure cookies
- Refresh token rotation
- Password reset flow
- Email verification
- Admin-created staff invitations
- Rate limiting for auth endpoints
- Account lockout after repeated failed logins
- Audit logs for sensitive actions
- Stronger input validation
- Security headers
- Role and permission management table
- Session/device management
- Tenant membership validation
- Cloud secret manager integration

---

## 25. Summary

The current authentication and security design provides a strong foundation for the Apollonia Dental Practice Employee Management System.

It supports signup, login, JWT authentication, protected dashboard access, role-based authorization, and tenant-aware data handling. The design is appropriate for the current project phase and can be extended into a stronger production-grade security model in future versions.
