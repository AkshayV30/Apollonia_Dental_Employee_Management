# Apollonia Dental Practice – Employee Management System

## Overview

Apollonia Dental Practice – Employee Management System is a full-stack web application designed to help a dental clinic manage its employees, departments, patient records, and internal staff assignments in a more organized and secure way.

The project was built as a professional learning and portfolio project. It demonstrates how a manual clinic workflow can be converted into a digital system that is easier to manage, easier to extend, and ready for future Employee & Customer Relationship Management features.

---

## Project Context

Apollonia Dental Practice is moving from manual staff and department tracking to a digital employee management platform.

The clinic needs a system that can:

- Maintain employee records in one place
- Organize employees by department
- Manage staff assignment across departments
- Secure access through login and roles
- Support future patient, revenue, and reporting features

This project represents the first major step toward a future clinic management and E-CRM platform.

---

## Current Features

The application currently supports:

- User signup and login
- Secure dashboard access
- Admin and staff user roles
- Employee record management
- Department management
- Employee-to-department assignment
- Department-wise staff view
- Patient record management
- Web-based dashboard interface

---

## Application Screens and Workflows

The system includes a simple dashboard where users can:

- Add employees
- Add departments
- Assign employees to departments
- View staff department-wise
- Add patient records
- View employee and patient lists
- Login and logout securely

The first registered user becomes an administrator. Additional users are treated as staff users.

---

## Technology Used

This project uses a modern full-stack setup:

- Angular for the frontend
- Node.js and Express for the backend
- PostgreSQL for the database
- Prisma for database access
- JWT for authentication
- TypeScript across the application

Detailed technical documentation is available inside the `docs/` folder.

---

## Project Structure

```text
.
├── apps
│   ├── backend
│   │   └── Nodejs
│   └── frontend
│       └── AngularApp
├── docs
├── infra
├── platform
└── README.md
```

---

## Documentation

More detailed documentation is available here:

| File                         | Description                   |
| ---------------------------- | ----------------------------- |
| `docs/00-overview.md`        | Project and business overview |
| `docs/01-architecture.md`    | Application architecture      |
| `docs/02-system-design.md`   | System design and workflows   |
| `docs/03-database-design.md` | Database design               |
| `docs/04-auth-security.md`   | Authentication and security   |
| `docs/05-api-reference.md`   | Backend API reference         |

---

## Running the Project Locally

### Backend

```bash
cd apps/backend/Nodejs
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

### Frontend

```bash
cd apps/frontend/AngularApp
npm install
ng serve
```

Frontend runs at:

```text
http://localhost:4200
```

---

## Demo Login Flow

Open:

```text
http://localhost:4200/login
```

Use the signup tab first to create the first admin user:

```text
Name: Admin User
Email: admin@apollonia.local
Password: password123
```

After signup, the user is redirected to the dashboard.

---

## Current Status

This project currently includes the main foundation for:

- Employee management
- Department management
- Patient record management
- Login and signup
- Role-based access
- PostgreSQL-backed data storage
- Angular dashboard interface

The system is ready to be extended into a larger clinic management or E-CRM platform.

---

## Future Improvements

Planned improvements include:

- User invitation system
- Better admin user management
- Password reset
- Audit logs
- Training and specialization records
- Patient-to-employee assignments
- Revenue tracking
- Dashboard charts and reports
- Docker-based deployment
- Cloud deployment
- CI/CD pipeline

---

## Disclaimer

This project is created for educational and portfolio purposes. The clinic name, employee data, and business scenario are used for demonstration only.
