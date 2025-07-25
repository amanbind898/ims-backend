
# 📦 Inventory Management System API

This is a backend API for managing users and product inventory. It supports:

- User registration and login (with JWT)
- Protected product CRUD APIs
- Swagger UI Documentation
- Prisma + PostgreSQL

---

## 🚀 Tech Stack

- Node.js (ESM)
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger (OpenAPI Docs)

---

## 📁 Project Structure

```
src/
├── index.js              # Main API entry point
├── middlewares/
│   └── auth.middleware.js
├── prisma/
│   └── schema.prisma
.env                      # Environment variables
```

---

## ⚙️ Environment Variables (`.env`)

```
PORT=8080
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<your_db>
JWT_SECRET=your-secret-key
```

---

## 📦 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Prisma setup
npx prisma generate
npx prisma migrate dev --name init

# 3. Start the server
npm run dev
```

> Swagger Docs: http://localhost:8080/api-docs

---

## 🔐 JWT Auth Flow

- Register via `POST /register`
- Login via `POST /login` → Get JWT token
- Use `Bearer <token>` in headers for protected routes

---

## 🔁 API Routes Summary

| Method | Endpoint                     | Description                  | Auth |
|--------|------------------------------|------------------------------|------|
| POST   | `/register`                  | Register new user            | ❌   |
| POST   | `/login`                     | Login & get JWT token        | ❌   |
| POST   | `/products`                  | Add new product              | ✅   |
| GET    | `/products?page=1`           | List all products            | ✅   |
| PUT    | `/products/:id/quantity`     | Update product quantity      | ✅   |

---

## 📄 API Documentation (Swagger)

- Visit: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## 📬 Postman Collection

Import the following JSON file into Postman:

```
File: inventory-api.postman_collection.json
```
