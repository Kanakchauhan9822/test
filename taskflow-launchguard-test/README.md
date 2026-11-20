# TaskFlow — Mini Task Manager

TaskFlow is a deliberately small full-stack JavaScript task manager. Users can register, log in, create tasks, set priorities, mark tasks as complete, filter tasks, and delete tasks.

This repository is intended as a **LaunchGuard evaluation fixture**. It includes a working happy path plus deliberately introduced security, reliability, logic, and code-quality problems. It is not production-ready.

## Project description

TaskFlow provides a simple personal workspace for tracking everyday tasks. The browser UI communicates with a REST API built with Express. The API issues JWTs for authentication and keeps demo data in memory so the project can be started without configuring a database.

## Tech stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js and Express
- Authentication: JSON Web Tokens
- Storage: in-memory JavaScript arrays

## Features

- User registration and login
- Create, read, update, and delete tasks
- Low, Medium, and High task priorities
- Pending and completed task states
- Filter tasks by status and priority
- Responsive dark dashboard

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:3000.

The demo stores users and tasks in memory. Data is reset when the server restarts. Register a new account before using the task dashboard.

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

Task routes expect `Authorization: Bearer <token>`.

## LaunchGuard test plan

Run a baseline review first. Then inspect the findings and use the source locations as a checklist.

This fixture intentionally contains examples of:

1. Hardcoded JWT secrets.
2. Plain-text password storage and comparison.
3. Missing registration validation and duplicate-email checks.
4. A task status filter that mutates task state instead of comparing it.
5. Missing task ownership checks on update and delete.
6. Unrestricted assignment of request-body fields to a task.
7. Unescaped task content inserted into `innerHTML`.
8. Sensitive token storage in browser local storage.
9. Generic error handling that returns HTTP 200.
10. Missing request-size limits and rate limiting.

Some findings overlap by design. Check whether LaunchGuard explains impact, points to the right file and line, gives a practical fix, and avoids reporting the same root cause as many unrelated findings.

## Suggested incremental-review experiment

1. Commit the untouched project and run **Review Latest Changes**.
2. Fix two or three findings (for example, password hashing, JWT secret configuration, and task ownership checks).
3. Commit and push those changes.
4. Run another review.
5. Check whether LaunchGuard marks fixed findings as resolved and keeps untouched findings as existing.

## Safety note

**Do not deploy this demo to the public internet or use real credentials or personal data.** The intentionally vulnerable code is included only for local, controlled testing. Fix the documented issues before treating the application as production software.
