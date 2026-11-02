<div align="center">

# ⚡ API Tester — React + Node.js

**A lightweight full-stack project to build, run, and test REST APIs using Postman or the built-in React UI.**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

This project gives you a ready-to-run REST API server built with **Express.js** and an optional **React** front-end that lets you fire requests and inspect responses — exactly like Postman, right in the browser.

Perfect for:
- Learning REST API concepts (CRUD operations, HTTP methods, status codes)
- Testing API behaviour quickly before wiring up a real database
- Practicing Postman or any HTTP client tool

---

## 🗂️ Project Structure

```
sample_project_for_vm/
│
├── server/                 ← Express REST API
│   ├── index.js            ← All routes defined here
│   └── package.json
│
├── client/                 ← React front-end (optional)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          ← API tester UI
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── .gitignore
├── package.json            ← Root convenience scripts
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| npm | v9+ | Comes with Node.js |
| Git | any | [git-scm.com](https://git-scm.com) |
| Postman | any | [postman.com](https://www.postman.com/downloads/) *(optional)* |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vishalbharath/sample_project_for_vm.git
cd sample_project_for_vm
```

### 2. Install dependencies

**Server (Express API):**
```bash
cd server
npm install
```

**Client (React UI) — optional:**
```bash
cd ../client
npm install
```

### 3. Start the API server

```bash
cd server
npm start
```

You should see:
```
🚀  API Server running on http://localhost:5000

Available endpoints:
  GET     /api/health
  GET     /api/users
  ...
```

### 4. (Optional) Start the React UI

Open a **second terminal**:
```bash
cd client
npm start
```

The React app opens at **http://localhost:3000** and lets you click any endpoint, fill in a body, and see the live JSON response.

> The React UI proxies all `/api/...` requests to `http://localhost:5000` automatically.

---

## 📡 API Reference

Base URL: `http://localhost:5000`

All responses follow this consistent shape:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

---

### 🟢 Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Returns server status and timestamp |

**Example response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-11-02T07:51:52.456Z"
}
```

---

### 👤 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get a single user by ID |
| `POST` | `/api/users` | Create a new user |
| `PUT` | `/api/users/:id` | Full replace of a user |
| `PATCH` | `/api/users/:id` | Partially update a user |
| `DELETE` | `/api/users/:id` | Delete a user |

#### Sample seed data (pre-loaded)

| ID | Name | Email | Role |
|----|------|-------|------|
| 1 | Alice Johnson | alice@example.com | admin |
| 2 | Bob Smith | bob@example.com | user |
| 3 | Carol White | carol@example.com | user |

#### `POST /api/users` — Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

> `name` and `email` are **required**. `role` defaults to `"user"`.

#### `PUT /api/users/:id` — Request Body

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin"
}
```

#### `PATCH /api/users/:id` — Request Body (any subset of fields)

```json
{
  "role": "moderator"
}
```

---

### 📦 Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products?category=Electronics` | Filter by category |
| `GET` | `/api/products/:id` | Get a single product by ID |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Full replace of a product |
| `DELETE` | `/api/products/:id` | Delete a product |

#### Sample seed data (pre-loaded)

| ID | Name | Price | Category | Stock |
|----|------|-------|----------|-------|
| 1 | Laptop | $999.99 | Electronics | 10 |
| 2 | Headphones | $149.99 | Electronics | 25 |
| 3 | Notebook | $4.99 | Stationery | 100 |

#### `POST /api/products` — Request Body

```json
{
  "name": "Keyboard",
  "price": 79.99,
  "category": "Electronics",
  "stock": 50
}
```

> `name` and `price` are **required**.

#### `PUT /api/products/:id` — Request Body

```json
{
  "name": "Keyboard Pro",
  "price": 99.99,
  "category": "Electronics",
  "stock": 30
}
```

---

### 🔁 Echo

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/echo` | Mirrors back your body + headers + query params |

**Request Body:**
```json
{
  "message": "Hello API!"
}
```

**Example response:**
```json
{
  "success": true,
  "message": "Echo response",
  "received": {
    "body": { "message": "Hello API!" },
    "headers": { "content-type": "application/json", "..." : "..." },
    "query": {}
  }
}
```

---

## 🧪 Testing with Postman

### Step 1 — Create a Collection

1. Open Postman → click **New** → **Collection**
2. Name it `API Tester`

### Step 2 — Set a Collection Variable

1. Click your collection → **Variables** tab
2. Add: `base_url` = `http://localhost:5000`

### Step 3 — Add & Test Requests

For each endpoint, create a new request inside the collection:

| URL | Method | Body type |
|-----|--------|-----------|
| `{{base_url}}/api/health` | GET | – |
| `{{base_url}}/api/users` | GET | – |
| `{{base_url}}/api/users/1` | GET | – |
| `{{base_url}}/api/users` | POST | raw → JSON |
| `{{base_url}}/api/users/1` | PUT | raw → JSON |
| `{{base_url}}/api/users/1` | PATCH | raw → JSON |
| `{{base_url}}/api/users/1` | DELETE | – |
| `{{base_url}}/api/products` | GET | – |
| `{{base_url}}/api/products?category=Electronics` | GET | – |
| `{{base_url}}/api/products` | POST | raw → JSON |
| `{{base_url}}/api/products/1` | DELETE | – |
| `{{base_url}}/api/echo` | POST | raw → JSON |

### Step 4 — Run All at Once

Use **Collection Runner** (▶ button) to run every request in sequence.

---

## 🔴 HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| `200` | OK — request succeeded |
| `201` | Created — resource was created |
| `400` | Bad Request — missing required fields |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — e.g. email already exists |

---

## 🛠️ Development Mode (auto-restart)

The server uses **nodemon** for automatic reloads when you edit `index.js`:

```bash
cd server
npm run dev
```

---

## 📝 License

MIT — free to use, fork, and learn from.

---

<div align="center">
Made with ❤️ for learning and testing REST APIs
</div>
