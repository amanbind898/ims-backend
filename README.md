# 🛒 Fi Money Inventory Management System

This is a simple inventory backend project built for Fi Money's backend assignment.

## 🔧 Tech Stack

- Node.js with Express
- Prisma ORM with PostgreSQL
- JSON Web Tokens for authentication
- Swagger (OpenAPI) for API Documentation
- HTML + Vanilla JS frontend

---

## 📦 Features

- User Registration & Login
- JWT Authentication (Bearer Token)
- Add Product (with image, type, SKU, price, quantity)
- Update Product Quantity
- View Paginated Products List
- Basic frontend with HTML
- Swagger UI for API Documentation
- Postman Collection for Testing

---
## 📁 Project Structure

```
├──Public/
  └──index.html            #Basic HTML Frontend
├──src/
  └──index.js              # Main API entry point
  └── middlewares/
       └── auth.middleware.js
├── prisma/
│   └── schema.prisma
├── tests/
│   └── api_test.py
├── .env                    # Environment variables
├── Dockerfile              # DockerFile     
```

## 📂 Database Schema (Prisma)

```
model User {
  id       Int     @id @default(autoincrement())
  username String  @unique
  password String
}

model Product {
  id          Int     @id @default(autoincrement())
  name        String
  type        String
  sku         String  @unique
  image_url   String   
  description String
  quantity    Int
  price       Float
}
```

## 🚀 Getting Started
 #### Backend :
### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ims-backend.git
cd ims-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up `.env`

Create a `.env` file in the root with:

```env
DATABASE_URL="xxxxxxxxxxxxxxx"
JWT_SECRET=your_secret_key
```

### 4. Set up Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the Server

```bash
npm start
```

API will run on `http://localhost:8080`

### 🖥️ Frontend :

Open the provided `index.html` file in the browser:

- Register/Login
- Add Products
- View Products
- Update Quantity
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
## 🧪 Testing

- Run the included test script:

```bash
cd tests
python test_api.py
```

> Make sure your server is running and `requests` is installed (`pip install requests`).

---

## 🌐 Swagger API Docs

Visit: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

- Full OpenAPI 3.0 support
- Includes login, register, add product, update quantity, get products

---

## 🖥️ Frontend 

Open the provided `index.html` file in the browser:

- Register/Login
- Add Products
- View Products
- Update Quantity

---
🚢 Docker Setup
===============

🧩 Prerequisites
----------------
- Docker Desktop installed
- `.env` file placed in the root directory (❗ no quotes in values)

🛠️ .env Example (Place in Project Root)
---------------------------------------
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=your_actual_api_key_here
JWT_SECRET=your_jwt_secret_here
PORT=8080

⚠️ DO NOT wrap values in double quotes `"..."`. Prisma will fail to parse the URL if quotes are used.

📦 Build Docker Image
---------------------
docker build -t ims-backend .

▶️ Run Docker Container
------------------------
docker run -p 8080:8080 --env-file .env ims-backend

- This starts the API server at http://localhost:8080.
- Make sure your `PORT` in `.env` is set to `8080` (or update the Dockerfile/EXPOSE accordingly).

✅ Dockerfile Summary
----------------------
- Installs dependencies with `npm ci`
- Uses `npx prisma generate` to create the Prisma client inside the image
- Runs as a non-root user (`nodejs`)
- Starts the app with `CMD ["node", "src/index.js"]`

## 🧠 AI Usage Disclosure

I used ChatGPT to assist in generating Swagger documentation, and writing the HTML frontend. I reviewed and tested everything manually.

---

---

## 👨‍💻 Author

**Aman Kumar Bind** – [CSE '26 @ IIIT Bhagalpur](https://github.com/amanbind898)
