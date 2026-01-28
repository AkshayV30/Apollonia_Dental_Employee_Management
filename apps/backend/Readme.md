# Apollonia Dental Practice – Employee Management Backend

## Overview

This repository contains the **backend service and database design** for the **Apollonia Dental Practice Employee Management System**.
It is built to manage **employees, departments, and their relationships** using a **normalized, scalable data model**.

The backend is designed with **real-world production principles** in mind—clean schema design, extensibility, and readiness for REST API integration, Dockerization, and cloud deployment.

---

## Key Objectives

- Centralized management of employee and department data
- Support **many-to-many relationships** between employees and departments
- Maintain **data integrity, scalability, and low redundancy**
- Serve as a foundation for future modules (patients, projects, scheduling)

---

## Tech Stack

| Layer       | Technology           |
| ----------- | -------------------- |
| Runtime     | Node.js              |
| Framework   | Express.js           |
| Database    | MongoDB              |
| ODM         | Mongoose             |
| API Docs    | Swagger / Postman    |
| DevOps      | Docker (planned)     |
| Cloud Ready | AWS / GCP compatible |

---

## Database Schema & Collections

### 1. `departments` Collection

Stores information about departments within the dental practice.

| Field  | Type   | Description                           |
| ------ | ------ | ------------------------------------- |
| `_id`  | String | Unique department ID (e.g., `DEP001`) |
| `name` | String | Department name                       |

**Example Document**

```json
{
  "_id": "DEP001",
  "name": "General Dentistry"
}
```

---

### 2️. `employees` Collection

Stores personal and professional information about employees.

| Field                 | Type   | Description                         |
| --------------------- | ------ | ----------------------------------- |
| `_id`                 | String | Unique employee ID (e.g., `EMP001`) |
| `first_name`          | String | First name                          |
| `last_name`           | String | Last name                           |
| `date_of_joining`     | String | Joining date (YYYY-MM-DD)           |
| `years_of_experience` | Number | Total professional experience       |
| `background_info`     | String | Role, specialization, or expertise  |

**Example Document**

```json
{
  "_id": "EMP001",
  "first_name": "Lisa",
  "last_name": "Harris",
  "date_of_joining": "2020-04-15",
  "years_of_experience": 4,
  "background_info": "Specialist in dental implants and cosmetic orthodontics."
}
```

---

### 3. `employee_departments` Collection (Junction Collection)

Implements a **many-to-many relationship** between employees and departments.

| Field           | Type   | Description                  |
| --------------- | ------ | ---------------------------- |
| `employee_id`   | String | References `employees._id`   |
| `department_id` | String | References `departments._id` |

**Example Document**

```json
{
  "employee_id": "EMP001",
  "department_id": "DEP003"
}
```

---

## How the System Works

### Data Flow

1. **Departments** are created and stored uniquely
2. **Employees** are stored independently with detailed profiles
3. **Relationships** are handled via `employee_departments` to ensure flexibility

---

## Example Queries

### Retrieve all employees in a department

1. Query `employee_departments` by `department_id`
2. Fetch employee records using `employee_id`

### Retrieve all departments for an employee

1. Query `employee_departments` by `employee_id`
2. Fetch department details using `department_id`

### Update department assignments

- Insert or delete records in `employee_departments`

---

## Advantages of This Design

- **No Data Redundancy** – Clean normalization
- **Highly Scalable** – Easy to add new modules
- **Efficient Updates** – Single source of truth
- **Query Flexibility** – Supports complex relationships
- **Production-Ready** – Mirrors enterprise database patterns

---

## REST API

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/api/employees`   | Fetch all employees           |
| POST   | `/api/employees`   | Create employee               |
| GET    | `/api/departments` | Fetch departments             |
| POST   | `/api/departments` | Create department             |
| POST   | `/api/assignments` | Assign employee to department |
