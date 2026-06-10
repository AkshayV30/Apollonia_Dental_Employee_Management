# Apollonia Dental Practice – Project Overview

## 1. Introduction

Apollonia Dental Practice – Employee Management System is a full-stack web application created to help a dental clinic manage its employees, departments, staff assignments, patient records, and secure user access.

The project represents the first implementation phase of a larger digital transformation goal. It starts with employee and department management and prepares the foundation for a future Employee & Customer Relationship Management platform.

This system is built as a professional learning and portfolio project, showing how a real business requirement can be converted into a structured, secure, and scalable software solution.

---

## 2. Business Context

Apollonia Dental Practice is moving from manual staff tracking to a digital management system.

The clinic currently needs a simple but reliable platform to:

- Store employee records in one place
- Maintain a list of clinic departments
- Assign employees to one or more departments
- View department-wise staff allocation
- Secure access through signup and login
- Support admin and staff-level users
- Prepare for future patient, revenue, and reporting features

The system is designed around the current needs of the clinic while keeping future expansion in mind.

---

## 3. Business Problem

Without a digital system, employee and department information can become difficult to manage as the clinic grows.

Common problems include:

- Employee records being scattered across manual files or spreadsheets
- Difficulty viewing which employee belongs to which department
- Repeated or inconsistent staff information
- No clear access control between admin and staff users
- Limited ability to expand into patient tracking or revenue reporting

This project solves the first layer of that problem by creating a structured employee and department management platform.

---

## 4. Project Objective

The main objective of this project is to create a secure and maintainable employee management system for Apollonia Dental Practice.

The system aims to:

- Digitize employee and department records
- Provide department-wise staff organization
- Allow secure access through authentication
- Support role-based access for admin and staff users
- Create a foundation for a future clinic E-CRM system
- Keep the application modular and easy to extend

---

## 5. Current Functional Scope

The current version includes the following features:

### Authentication

- User signup
- User login
- Secure token-based access
- Protected dashboard
- Logout functionality

### User Roles

- Admin user
- Staff user
- Role-aware backend access control

The first user registered for the clinic becomes an admin. Later users are treated as staff users.

### Employee Management

- Add employee records
- View employee list
- Store professional details such as specialization, experience, and background information
- Link employees to departments

### Department Management

- Add clinic departments
- View department list
- View department-wise employee allocation

### Assignment Management

- Assign employees to departments
- View current employee-department assignments
- Remove assignments based on user permission

### Patient Management

- Add patient records
- View patient list
- Store basic treatment notes

---

## 6. Seeded Clinic Data

The system is based on the initial business data provided for Apollonia Dental Practice.

### Departments

- General Dentistry
- Pediatric Dentistry
- Restorative Dentistry
- Surgery
- Orthodontics

### Employees

- Lisa Harris
- Alfred Christensen
- John Dudley
- Danny Perez
- Sarah Alvarez
- Constance Smith
- Travis Combs
- Francisco Willard
- Janet Doe
- Leslie Roche

### Initial Staff Allocation

| Department            | Employees                                      |
| --------------------- | ---------------------------------------------- |
| General Dentistry     | Alfred Christensen, John Dudley, Janet Doe     |
| Pediatric Dentistry   | Francisco Willard, Sarah Alvarez, Travis Combs |
| Restorative Dentistry | Lisa Harris, Danny Perez                       |
| Surgery               | Constance Smith                                |
| Orthodontics          | Leslie Roche, Lisa Harris                      |

---

## 7. Current Application Users

The system currently supports two main user types.

| User Type | Description                                               |
| --------- | --------------------------------------------------------- |
| Admin     | Has wider access to manage records and remove assignments |
| Staff     | Can access the dashboard and create operational records   |

A future version may include a viewer role for read-only users.

---

## 8. Technology Summary

The application uses a modern full-stack architecture.

| Area           | Technology          |
| -------------- | ------------------- |
| Frontend       | Angular             |
| Backend        | Node.js, Express.js |
| Language       | TypeScript          |
| Database       | PostgreSQL          |
| ORM            | Prisma              |
| Authentication | JWT                 |
| Styling        | SCSS                |

Technical details are documented separately in the architecture, database, API, and security documentation files.

---

## 9. High-Level System Flow

```text
User opens Angular frontend
        ↓
User signs up or logs in
        ↓
Backend verifies credentials
        ↓
JWT token is issued
        ↓
Frontend stores token
        ↓
Authenticated user accesses dashboard
        ↓
Dashboard communicates with protected backend APIs
        ↓
Backend reads/writes data through Prisma
        ↓
PostgreSQL stores clinic records
```

---

## 10. Project Value

This project demonstrates how a small business workflow can be converted into a structured software system.

It provides value by:

- Reducing manual record management
- Improving department-wise visibility
- Creating a cleaner staff management workflow
- Introducing secure access control
- Preparing the clinic for future CRM features
- Providing a scalable base for more advanced modules

---

## 11. Future Expansion

The current system is intentionally designed as a foundation.

Future versions can include:

- Staff training records
- Specialization tracking
- Patient-to-employee assignment
- Revenue tracking
- Appointment scheduling
- Dashboard charts and analytics
- Audit logs
- Admin user management
- Password reset flow
- Docker-based deployment
- Cloud hosting

---

## 12. Project Status

The current version includes the main foundation for a clinic employee management platform:

- Frontend dashboard
- Backend REST API
- PostgreSQL database
- Authentication
- Role-based access
- Employee and department workflows
- Patient record foundation

The project is ready to be extended into a broader clinic management or E-CRM platform.

---

## 13. Disclaimer

This project is created for educational and portfolio purposes.

The clinic name, employee records, and business scenario are used only to demonstrate software design, full-stack development, and system architecture.
