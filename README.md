# Meta Task Manager

A production-minded multi-tenant task management application built with Laravel, React, and TypeScript.

The application allows teams to securely manage tasks within their own tenant/workspace, with authentication, task assignment, search, filtering, pagination, dashboard statistics, and a responsive user interface.

---

## Project Overview

Meta Task Manager is a small full-stack task management application designed with a focus on clean architecture, maintainability, tenant isolation, validation, testing, and usability.

The project intentionally keeps the scope focused on the core task-management workflow rather than introducing unnecessary enterprise-level complexity.

### Key capabilities

- Secure authentication using Laravel Sanctum
- Multi-tenant task management
- Tenant-isolated task access
- Task creation, update, and deletion
- Task assignment
- Status and priority management
- Server-side search
- Status and priority filtering
- Pagination
- Dashboard statistics
- Responsive desktop and mobile UI
- Backend feature tests
- Frontend linting and production build validation

---

# Tech Stack

## Backend

- PHP 8.2
- Laravel 12
- Laravel Sanctum
- MySQL
- Eloquent ORM

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS

## Development Tools

- Composer
- npm
- Git
- ESLint

---

# Project Structure

```text
meta-task-manager/
│
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Support/
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   ├── routes/
│   │   └── api.php
│   │
│   └── tests/
│       ├── Feature/
│       └── Unit/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── public/
│
└── README.md
```

---

# Installation and Running the Project

Follow the steps below from a fresh clone.

## 1. Prerequisites

Make sure the following are installed:

- PHP 8.2+
- Composer
- Node.js
- npm
- MySQL
- Git

---

## 2. Clone the Repository

```bash
git clone https://github.com/sandipr773/meta-task-manager.git
cd meta-task-manager
```

---

## 3. Configure and Start the Laravel Backend

Open a terminal and move into the backend directory:

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file.

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Next, create a MySQL database and configure the database credentials in `backend/.env`.

Example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=meta_task_manager
DB_USERNAME=root
DB_PASSWORD=
```

Use the credentials appropriate for your local MySQL installation.

For a fresh local setup, run:

```bash
php artisan migrate:fresh --seed
```

This creates the database schema and seeds demo data.

The seeders create two tenants:

```text
Acme Education
Bright Healthcare
```

Two demo administrator accounts are also created:

```text
Acme Admin
Bright Admin
```

The Acme Education tenant is populated with demo tasks covering different statuses and priorities. This allows search, filtering, and pagination to be tested immediately.

Start the Laravel development server:

```bash
php artisan serve
```

The backend API will normally be available at:

```text
http://127.0.0.1:8000
```

---

## 4. Start the React Frontend

Keep the Laravel server running and open a second terminal.

From the project root:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

# Demo Login

The database seeder creates the following accounts.

## Acme Administrator

```text
Email: admin@acme.test
Password: password
```

## Bright Administrator

```text
Email: admin@bright.test
Password: password
```

These credentials are intended for local development and testing only.

---

# Application Workflow

After starting both backend and frontend servers:

1. Open `http://localhost:5173`
2. Login using one of the demo accounts
3. Open the Dashboard to view task statistics and recent tasks
4. Open the Tasks page to manage tasks
5. Create a new task
6. Assign the task to a tenant user
7. Change task status
8. Filter tasks by status or priority
9. Search tasks by title
10. Navigate through paginated results
11. Delete tasks when required

The frontend communicates with the Laravel API for authentication and task operations.

---

# Architecture

The backend follows a lightweight layered architecture.

```text
HTTP Request
     |
     v
Route
     |
     v
Middleware
     |
     v
Controller
     |
     +---- Form Request Validation
     |
     v
Service Layer
     |
     v
Eloquent Model
     |
     v
MySQL
```

### Middleware

Authentication and tenant requirements are enforced before tenant-protected endpoints are executed.

### Form Requests

Task creation and update validation are handled using dedicated Form Request classes.

### Controllers

Controllers handle HTTP concerns and coordinate requests between validation and application services.

### Service Layer

Task-related business operations and tenant-aware querying are handled by `TaskService`.

### Models

Eloquent models represent application entities and their relationships.

### Frontend

The React frontend is organized into pages, layouts, reusable components, API services, hooks, typed models, and utilities.

---

# Multi-Tenant Design

The application uses a tenant-based data isolation model.

Each user belongs to a tenant through:

```text
users.tenant_id
```

Each task belongs to a tenant through:

```text
tasks.tenant_id
```

Tenant information is derived from the authenticated user.

Task listing is scoped to the authenticated user's tenant.

When creating a task, the authenticated user's tenant is explicitly assigned to the task.

Individual task operations also verify that the task belongs to the authenticated user's tenant before allowing access.

If a user attempts to access a task belonging to another tenant, the API returns:

```text
404 Not Found
```

Task assignment is also tenant-aware.

The selected assignee must:

1. Exist in the users table
2. Belong to the authenticated user's tenant

This prevents cross-tenant task assignment.

---

# Features

## Authentication

- Laravel Sanctum token-based authentication
- Login
- Logout
- Protected API routes
- Protected frontend routes
- Generic invalid-login response

## Task Management

- Create task
- Update task
- Delete task
- Assign task
- Change task status
- Set task priority
- Add task description

## Search and Filtering

The task list supports:

- Server-side title search
- Status filtering
- Priority filtering
- Pagination

Search and filtering are applied by the backend before pagination.

Example:

```text
GET /api/tasks?search=Laravel&status=todo&page=1
```

Multiple filters can be combined:

```text
GET /api/tasks?search=Laravel&status=todo&priority=high&page=1
```

## Dashboard

The dashboard displays:

- Total tasks
- To-do tasks
- In-progress tasks
- Completed tasks
- Recent tasks

## Responsive UI

The interface is designed for both desktop and mobile screens.

The task page provides:

- Desktop table layout
- Mobile task cards
- Loading states
- Empty states
- Error messages
- Delete confirmation
- Responsive filters
- Status controls
- Priority indicators

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Authenticate user and create Sanctum token |
| POST | `/api/logout` | Revoke current authentication token |
| GET | `/api/user` | Get authenticated user |

## Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get users belonging to the current tenant |

## Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tenant tasks |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/{task}` | Get a specific task |
| PUT/PATCH | `/api/tasks/{task}` | Update a task |
| DELETE | `/api/tasks/{task}` | Delete a task |
| GET | `/api/tasks/stats` | Get dashboard statistics |

---

# Validation Rules

Task creation and updates use dedicated Laravel Form Request classes.

## Title

- Required when creating a task
- Must be a string
- Maximum 255 characters

## Status

Allowed values:

```text
todo
in_progress
done
```

## Priority

Allowed values:

```text
low
medium
high
```

## Assignee

The selected assignee must belong to the authenticated user's tenant.

---

# Testing and Validation

The project was validated using automated tests as well as manual functional testing.

## Backend Tests

From the `backend` directory:

```bash
php artisan test
```

Current result:

```text
10 tests passed
26 assertions
```

The feature tests cover important scenarios including:

- Task creation
- Required title validation
- Cross-tenant task access prevention
- Cross-tenant task update prevention
- Cross-tenant task assignment prevention
- Authentication protection
- Task update
- Task deletion

## Frontend Lint

From the `frontend` directory:

```bash
npm run lint
```

Current result:

```text
ESLint passed with no errors or warnings.
```

## Frontend Production Build

```bash
npm run build
```

The TypeScript compilation and Vite production build complete successfully.

---

# Technical Decisions

## Laravel + React

Laravel was selected for the backend because it provides a mature structure for routing, authentication, validation, ORM, and automated testing.

React with TypeScript was selected for the frontend to provide a component-based architecture with static typing.

## Service Layer

Task operations are handled through `TaskService` rather than placing all business logic inside controllers.

This keeps controllers focused on HTTP concerns and makes the application easier to maintain.

## Form Requests

Task validation is separated into:

```text
StoreTaskRequest
UpdateTaskRequest
```

This keeps validation rules independent from controller logic.

## Tenant Context

Tenant identification is centralized through `TenantContext`.

This provides a clear boundary for tenant-aware business operations.

## Tenant Authorization

Tenant access is enforced through multiple layers:

- Tenant middleware protects tenant-specific routes
- Tenant-aware queries scope task listings
- Task creation explicitly assigns the authenticated tenant
- Individual task operations verify tenant ownership
- Task assignment validates same-tenant users

## Eager Loading

Creator and assignee relationships are eager loaded when retrieving tasks to avoid unnecessary repeated database queries when displaying related user information.

## Server-Side Search and Pagination

Search, filtering, and pagination are handled by the backend.

This ensures that search results are calculated across the complete tenant task set before pagination instead of filtering only the currently loaded frontend page.

## Responsive UI

The frontend provides desktop and mobile-specific task presentations to maintain usability across different screen sizes.

---

# Assumptions

- Each user belongs to exactly one tenant.
- Each task belongs to exactly one tenant.
- Users can assign tasks only to users within their own tenant.
- Task statuses are limited to `todo`, `in_progress`, and `done`.
- Task priorities are limited to `low`, `medium`, and `high`.
- Authentication is handled using Laravel Sanctum personal access tokens.
- The application is intentionally focused on task management rather than being a complete project-management platform.
- Demo credentials are provided only for local development and testing.

---

# Limitations and Future Improvements

The implementation intentionally keeps the scope focused on the assessment requirements.

Potential future improvements include:

- Role-based permissions such as Admin, Manager, and Member
- Laravel Policies for more granular authorization
- Debounced frontend search
- Task detail/edit modal
- Task sorting
- Automated API documentation
- More comprehensive frontend tests
- CI/CD pipeline
- Production-specific logging and monitoring
- Advanced task filtering

---

# AI-Assisted Development

AI tools were used as an implementation and review aid during development.

AI assistance was used for:

- Exploring implementation approaches
- Reviewing code structure
- Identifying potential edge cases
- Assisting with debugging
- Improving UI/UX
- Reviewing validation and tenant isolation
- Assisting with test scenarios
- Preparing project documentation

All generated or suggested changes were reviewed and validated before being integrated into the project.

Validation included:

- Laravel automated tests
- ESLint
- TypeScript compilation
- Vite production build
- Manual API testing
- Manual frontend testing
- Multi-tenant isolation testing

The final implementation and technical decisions were reviewed against the assessment requirements.

---

# Final Validation Summary

The application has been validated through automated and manual testing.

### Backend

```text
10 tests passed
26 assertions
```

### Frontend

```text
ESLint passed
TypeScript compilation passed
Production build passed
```

### Manually Verified

- Authentication
- Logout
- Protected routes
- Task creation
- Task update
- Task deletion
- Task assignment
- Tenant-specific users
- Cross-tenant task isolation
- Server-side search
- Status filtering
- Priority filtering
- Search with pagination
- Dashboard statistics
- Responsive task UI

---

# Submission Notes

This project is designed as a focused take-home technical exercise implementation.

The implementation prioritizes:

- Correctness
- Security
- Maintainability
- Reasonable architecture
- Test coverage of important behavior
- Responsive usability
- Clear technical decisions

The solution intentionally avoids unnecessary complexity while keeping the structure extensible for future requirements.
