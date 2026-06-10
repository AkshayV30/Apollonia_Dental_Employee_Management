# Apollonia Dental Practice – Database Design

## 1. Purpose

This document explains the database design of the Apollonia Dental Practice Employee Management System.

The system uses a relational database structure to manage employees, departments, users, patients, and assignments in a clean and scalable way.

The database is designed to support the current employee management requirements while also preparing the project for future clinic management and E-CRM features.

---

## 2. Database Technology

The project uses:

| Area                 | Technology        |
| -------------------- | ----------------- |
| Database             | PostgreSQL        |
| ORM                  | Prisma            |
| Query Layer          | Prisma Client     |
| Schema Management    | Prisma Migrations |
| Language Integration | TypeScript        |

---

## 3. Why PostgreSQL Was Chosen

PostgreSQL is used because the application data is highly relational.

The system needs to manage relationships such as:

- One clinic has many users
- One clinic has many employees
- One clinic has many departments
- One employee can belong to many departments
- One department can have many employees
- One clinic can have many patients
- Future patients can be assigned to employees
- Future revenue can be linked to patients

These relationships are easier to manage with a relational database than with a document-based database.

---

## 4. Why Prisma Was Chosen

Prisma is used as the ORM layer between the backend and PostgreSQL.

Prisma helps with:

- Defining the database schema in one place
- Creating database migrations
- Generating type-safe database queries
- Handling relationships cleanly
- Reducing manual SQL in the application code
- Making future schema changes easier

---

## 5. Database Design Goals

The database is designed around the following goals:

- Avoid duplicate data
- Keep employee and department records separate
- Support many-to-many employee-department assignment
- Keep authentication data separate from employee records
- Support tenant-aware data isolation
- Prepare for future SaaS and E-CRM expansion
- Keep the schema easy to understand and extend

---

## 6. High-Level Entity List

The current database design includes these main entities:

```text id="gdmf1n"
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

Current active features mainly use:

```text id="rq0hw9"
Tenant
User
Employee
Department
EmployeeDepartment
Patient
```

Future expansion can use:

```text id="rmew15"
EmployeePatient
Revenue
Training
Specialization
```

---

## 7. Entity Relationship Overview

```text id="q5krbt"
Tenant
 ├── Users
 ├── Employees
 ├── Departments
 └── Patients

Employee
 └── EmployeeDepartment
       └── Department

Patient
 ├── EmployeePatient
 └── Revenue
```

The most important current relationship is:

```text id="fwt1kr"
Employee ↔ Department
```

This is a many-to-many relationship handled through:

```text id="2fyhr0"
employee_departments
```

---

## 8. Tenant Table

The `tenants` table represents a clinic or organization.

For this project, the default tenant is:

```text id="wsbvo7"
apollonia
```

### Purpose

The tenant table prepares the application for future SaaS support, where multiple clinics may use the same system.

### Fields

| Field        | Type        | Description                            |
| ------------ | ----------- | -------------------------------------- |
| `id`         | UUID/String | Unique internal tenant ID              |
| `name`       | String      | Clinic or organization name            |
| `slug`       | String      | Tenant identifier, such as `apollonia` |
| `created_at` | DateTime    | Creation timestamp                     |
| `updated_at` | DateTime    | Last update timestamp                  |

### Example

```json id="1yyrx5"
{
  "id": "tenant-uuid",
  "name": "Apollonia Dental Practice",
  "slug": "apollonia"
}
```

---

## 9. Users Table

The `users` table stores application login accounts.

This is separate from the `employees` table because a system user is not always the same as an employee record.

### Purpose

The users table supports:

- Signup
- Login
- Password authentication
- Role-based access
- User status management
- Tenant-specific users

### Fields

| Field           | Type        | Description                   |
| --------------- | ----------- | ----------------------------- |
| `id`            | UUID/String | Unique user ID                |
| `tenant_id`     | UUID/String | References tenant             |
| `name`          | String      | User display name             |
| `email`         | String      | Login email                   |
| `password_hash` | String      | Hashed password               |
| `role`          | Enum        | `ADMIN`, `STAFF`, or `VIEWER` |
| `status`        | Enum        | `ACTIVE` or `DISABLED`        |
| `last_login_at` | DateTime    | Last successful login time    |
| `created_at`    | DateTime    | Creation timestamp            |
| `updated_at`    | DateTime    | Last update timestamp         |

### Important Constraint

```text id="phcujw"
unique(tenant_id, email)
```

This means the same email cannot be duplicated inside the same tenant.

### Role Values

| Role     | Meaning                                 |
| -------- | --------------------------------------- |
| `ADMIN`  | Full access                             |
| `STAFF`  | Operational access                      |
| `VIEWER` | Read-only access planned for future use |

---

## 10. Employees Table

The `employees` table stores clinic employee profile information.

### Purpose

The employees table supports:

- Employee record creation
- Employee list display
- Department assignment
- Future training and specialization links

### Fields

| Field                 | Type        | Description                             |
| --------------------- | ----------- | --------------------------------------- |
| `id`                  | UUID/String | Internal employee ID                    |
| `tenant_id`           | UUID/String | References tenant                       |
| `employee_code`       | String      | Business employee code such as `EMP001` |
| `first_name`          | String      | Employee first name                     |
| `last_name`           | String      | Employee last name                      |
| `date_of_joining`     | DateTime    | Joining date                            |
| `specialization`      | String      | Dental specialization                   |
| `years_of_experience` | Number      | Years of professional experience        |
| `background_info`     | String      | Additional profile information          |
| `created_at`          | DateTime    | Creation timestamp                      |
| `updated_at`          | DateTime    | Last update timestamp                   |

### Important Constraint

```text id="k5o242"
unique(tenant_id, employee_code)
```

This allows each clinic to have its own employee numbering.

### Example

```json id="g3upgk"
{
  "employee_code": "EMP001",
  "first_name": "Lisa",
  "last_name": "Harris",
  "specialization": "Restorative Dentistry",
  "years_of_experience": 4
}
```

---

## 11. Departments Table

The `departments` table stores clinic department information.

### Purpose

The departments table supports:

- Department creation
- Department list display
- Employee assignment
- Department-wise staff views

### Fields

| Field             | Type        | Description                               |
| ----------------- | ----------- | ----------------------------------------- |
| `id`              | UUID/String | Internal department ID                    |
| `tenant_id`       | UUID/String | References tenant                         |
| `department_code` | String      | Business department code such as `DEP001` |
| `name`            | String      | Department name                           |
| `created_at`      | DateTime    | Creation timestamp                        |
| `updated_at`      | DateTime    | Last update timestamp                     |

### Important Constraints

```text id="v78pgc"
unique(tenant_id, department_code)
unique(tenant_id, name)
```

This prevents duplicate department names and duplicate department codes within the same clinic.

### Example

```json id="j9fy1o"
{
  "department_code": "DEP001",
  "name": "General Dentistry"
}
```

---

## 12. Employee Departments Table

The `employee_departments` table is a junction table.

It handles the many-to-many relationship between employees and departments.

### Why This Table Is Needed

An employee can belong to more than one department.

Example:

```text id="lcnrc8"
Lisa Harris → Restorative Dentistry
Lisa Harris → Orthodontics
```

A department can also have many employees.

Example:

```text id="9c247z"
General Dentistry → Alfred Christensen, John Dudley, Janet Doe
```

This cannot be handled cleanly by storing one department field inside the employee table.

### Fields

| Field           | Type        | Description           |
| --------------- | ----------- | --------------------- |
| `employee_id`   | UUID/String | References employee   |
| `department_id` | UUID/String | References department |
| `assigned_at`   | DateTime    | Assignment timestamp  |

### Primary Key

```text id="df31pe"
(employee_id, department_id)
```

This prevents the same employee from being assigned to the same department more than once.

### Example

```json id="owiafb"
{
  "employee_id": "EMP001-internal-id",
  "department_id": "DEP003-internal-id",
  "assigned_at": "2026-06-10T10:00:00.000Z"
}
```

---

## 13. Patients Table

The `patients` table stores basic patient records.

### Purpose

The patient table is included as the first step toward future E-CRM functionality.

Current patient features include:

- Creating patient records
- Viewing patient records
- Storing treatment notes

### Fields

| Field             | Type        | Description                            |
| ----------------- | ----------- | -------------------------------------- |
| `id`              | UUID/String | Internal patient ID                    |
| `tenant_id`       | UUID/String | References tenant                      |
| `patient_code`    | String      | Business patient code such as `PAT001` |
| `patient_name`    | String      | Patient name                           |
| `patient_image`   | String      | Optional image URL                     |
| `treatment_notes` | String      | Basic treatment notes                  |
| `created_at`      | DateTime    | Creation timestamp                     |
| `updated_at`      | DateTime    | Last update timestamp                  |

### Important Constraint

```text id="q0dgf4"
unique(tenant_id, patient_code)
```

### Example

```json id="t00v5i"
{
  "patient_code": "PAT001",
  "patient_name": "Patient Name",
  "treatment_notes": "Initial consultation completed."
}
```

---

## 14. Employee Patients Table

The `employee_patients` table is planned for future use.

### Purpose

It will allow the system to assign patients to staff members.

This will support workflows such as:

- Dentist assigned to patient
- Surgeon assigned to patient
- Staff workload tracking
- Patient follow-up responsibility

### Relationship

```text id="1x6p0e"
Employee ↔ Patient
```

This is a many-to-many relationship because:

- One employee can handle many patients
- One patient may be handled by more than one employee

---

## 15. Revenue Table

The `revenues` table is planned for future analytics.

### Purpose

It will help track:

- Revenue per patient
- Revenue per treatment
- Revenue per employee
- Revenue per department
- Clinic performance reporting

### Fields

| Field          | Description          |
| -------------- | -------------------- |
| `id`           | Revenue record ID    |
| `patient_id`   | Linked patient       |
| `amount`       | Revenue amount       |
| `description`  | Revenue note         |
| `revenue_date` | Revenue date         |
| `created_at`   | Record creation time |

---

## 16. Training Table

The `trainings` table is planned for future staff development tracking.

### Purpose

It can store:

- Training programs
- Certification courses
- Staff learning records
- Compliance-related training

---

## 17. Specialization Table

The `specializations` table is planned for future normalization of staff skills.

### Purpose

It can store reusable specialization values such as:

- General Dentistry
- Pediatric Dentistry
- Restorative Dentistry
- Surgery
- Orthodontics

Currently, specialization is stored directly on the employee record for simplicity.

---

## 18. Current Seed Data

The system includes initial clinic data.

### Departments

| Code     | Name                  |
| -------- | --------------------- |
| `DEP001` | General Dentistry     |
| `DEP002` | Pediatric Dentistry   |
| `DEP003` | Restorative Dentistry |
| `DEP004` | Surgery               |
| `DEP005` | Orthodontics          |

### Employees

| Code     | Name               | Specialization        |
| -------- | ------------------ | --------------------- |
| `EMP001` | Lisa Harris        | Restorative Dentistry |
| `EMP002` | Alfred Christensen | General Dentistry     |
| `EMP003` | John Dudley        | General Dentistry     |
| `EMP004` | Danny Perez        | Restorative Dentistry |
| `EMP005` | Sarah Alvarez      | Pediatric Dentistry   |
| `EMP006` | Constance Smith    | Surgery               |
| `EMP007` | Travis Combs       | Pediatric Dentistry   |
| `EMP008` | Francisco Willard  | Pediatric Dentistry   |
| `EMP009` | Janet Doe          | General Dentistry     |
| `EMP010` | Leslie Roche       | Orthodontics          |

### Employee-Department Assignments

| Employee           | Department            |
| ------------------ | --------------------- |
| Alfred Christensen | General Dentistry     |
| John Dudley        | General Dentistry     |
| Janet Doe          | General Dentistry     |
| Sarah Alvarez      | Pediatric Dentistry   |
| Travis Combs       | Pediatric Dentistry   |
| Francisco Willard  | Pediatric Dentistry   |
| Lisa Harris        | Restorative Dentistry |
| Danny Perez        | Restorative Dentistry |
| Constance Smith    | Surgery               |
| Leslie Roche       | Orthodontics          |
| Lisa Harris        | Orthodontics          |

---

## 19. Data Integrity Rules

The database design supports several integrity rules:

### Unique Codes Per Tenant

Each tenant can have its own employee, department, and patient codes.

Examples:

```text id="tq7yg2"
EMP001 can exist in Apollonia
EMP001 can also exist in another future clinic
```

But inside the same tenant, duplicate codes are not allowed.

---

### Prevent Duplicate Assignments

The `employee_departments` table uses a composite primary key:

```text id="o4ubkn"
employee_id + department_id
```

This prevents duplicate employee-department assignments.

---

### Cascade Delete Behavior

When a parent record is deleted, related records can be removed through cascade behavior.

Example:

```text id="lnil98"
If an employee is deleted, their employee-department assignments are removed.
```

This prevents broken relationship records.

---

## 20. Tenant-Aware Design

Most major tables are connected to a tenant.

This allows data to be scoped by clinic.

Example:

```text id="oy74pk"
Tenant: Apollonia Dental Practice
 ├── Users
 ├── Employees
 ├── Departments
 └── Patients
```

The frontend sends:

```text id="lcrz5s"
x-tenant-id: apollonia
```

The backend uses that value to find the correct tenant and apply tenant-specific database queries.

---

## 21. Current Prisma Model Overview

The current Prisma schema is organized around:

```text id="tfc3r7"
model Tenant
model User
model Employee
model Department
model EmployeeDepartment
model Patient
model EmployeePatient
model Revenue
model Training
model Specialization
```

The schema also includes enums:

```text id="cn2wcc"
enum UserRole
enum UserStatus
```

---

## 22. Why This Design Is Scalable

This database design is scalable because:

- Authentication users are separate from employee records
- Employees and departments are normalized
- Many-to-many assignments are handled cleanly
- Tenant-aware records support future SaaS behavior
- Future modules can be added without redesigning the core schema
- Reporting and analytics are easier with relational data

---

## 23. Future Database Improvements

Future versions can improve the database with:

- User invitation table
- Password reset token table
- Audit log table
- Appointment table
- Treatment table
- Patient assignment table activation
- Revenue reporting tables
- File upload metadata table
- Role permission table
- Soft delete fields
- Search indexes
- Pagination-friendly indexes

---

## 24. Summary

The database is designed as a relational foundation for a clinic employee management system.

It currently supports users, employees, departments, assignments, and patients. It also prepares the project for future E-CRM features such as patient assignments, revenue tracking, training records, specializations, and reporting.
