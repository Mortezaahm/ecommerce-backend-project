# 🥤 Juice Shop – Full Stack E-commerce Application

A full-stack e-commerce web application focused on selling beverages.  
Users can register, log in, browse products, leave reviews, and rate items. 
Only admins are able to create, update and delete products , users, categories 
and orders. There is a admin panel as well.

This project demonstrates a modern backend architecture using TypeScript, REST APIs, authentication, and hybrid database design.

---

## 🚀 Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (Fetch API)

### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Zod (Validation)

### Databases
- MySQL (Relational Data)
- MongoDB (Reviews & Ratings)

---

## 📦 Features

### 🔐 Authentication
- User registration with validation
- Login with JWT token
- Protected routes
- Role-based access (User / Admin)

### 🛍️ Products
- Browse all products
- View single product
- Filter products by:
  - Price range
  - Category
  - Sorting options
  - Highest rated

### 🧾 Reviews & Ratings
- Users can:
  - Leave reviews
  - Rate products (1–5 stars)
- Reviews stored in MongoDB

### 🧑‍💼 Admin Capabilities
- Create products
- Manage product data
- Restricted access via middleware

---

## 🗄️ Database Design

### MySQL (Relational)
Used for structured and relational data:
- Users
- Products
- Categories
- Orders (optional extension)

Includes:
- Foreign keys
- Normalized tables
- Data integrity constraints

### MongoDB (NoSQL)
Used for flexible data:
- Product reviews
- Ratings

---

## 🔌 API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (Admin only)

### Reviews
- `POST /api/reviews`
- `GET /api/reviews/:productId`

---

## 🧪 Testing

API endpoints tested using:
- Insomnia / Postman

---

## 🛠️ Project Structure
