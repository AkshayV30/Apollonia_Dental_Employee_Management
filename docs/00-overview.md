# Apollonia Dental Practice – Employee Management System

## Project Overview

This project is an **initial-stage Employee Management System (EMS)** designed for _Apollonia Dental Practice_.
It addresses the clinic’s current operational need to **manage medical staff records by department**, while laying a **scalable foundation** for a future **Employee & Customer Relationship Management (E-CRM)** platform.

The application is built with **enterprise-grade frontend architecture**, focusing on **clarity, extensibility, and role-based access readiness**.

---

## Business Objective

Apollonia Dental Practice requires a system that can:

- Maintain a structured list of **departments**
- Manage **employee records**
- Associate employees with **one or more departments**
- Support **future expansion** into:
  - Training & specialization tracking
  - Patient assignments
  - Revenue analytics
  - Project & workload management

This repository represents the **first milestone** toward that long-term vision.

---

## Current Organisational Data (Seeded)

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

### Staff Allocation (Initial State)

| Department            | Employees                                  |
| --------------------- | ------------------------------------------ |
| General Dentistry     | Alfred Christensen, John Dudley, Janet Doe |
| Pediatric Dentistry   | Francisco Willard, Sarah Alvarez           |
| Restorative Dentistry | Lisa Harris, Danny Perez                   |
| Surgery               | Constance Smith                            |
| Orthodontics          | Leslie Roche, Lisa Harris                  |

---

## Functional Scope (Current Phase)

✔ Department Management
✔ Employee Records (Name, Surname, Department)
✔ Employee–Department Mapping
✔ Clean CRUD workflows
✔ Frontend-ready RBAC structure
✔ Modular Angular architecture

> Patient data, revenue tracking, and CRM features are **intentionally excluded** from this phase.

---

## Application Architecture (High Level)

```
src/
 ├── app/
 │   ├── auth/        → Authentication & guards (extensible)
 │   ├── admin/       → Department & employee administration
 │   ├── staff/       → Staff-facing views
 │   ├── core/        → Services, interceptors, models
 │   ├── shared/      → Reusable UI components & utilities
 │   └── app.module.ts
```

This structure mirrors **real-world enterprise Angular applications** and supports future scaling without refactoring.

---

## Security & Access (Design-Ready)

- Role-Based Access Control (RBAC) **designed**
- Auth module **isolated**
- Admin vs Staff responsibility separation
- API-layer authorization planned (backend-agnostic)

> Authentication logic is abstracted to avoid exposing implementation details.

---

## Frontend Technology Stack

- **Angular (Standalone / Modular Architecture)**
- **TypeScript**
- **SCSS (Sass)**
- Reactive Forms
- Angular Router
- Service-driven state management

---

## Future Roadmap (Planned)

- Training & certification tracking
- Staff specializations
- Patient management
- Revenue analytics
- CRM integration
- Audit logs & reporting
- Backend integration (REST / GraphQL)

---

## Engineering Intent

This project demonstrates:

- Translation of **business requirements → technical design**
- Modular frontend architecture
- Scalable CRUD systems
- Enterprise-grade documentation discipline
- Clean separation of concerns

---

## Disclaimer

This repository is an **educational and portfolio project** created for assessment and learning purposes.
Business data is fictional and used solely to demonstrate system design.
