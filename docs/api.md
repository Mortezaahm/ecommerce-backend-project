# API Documentation

## Base URL

http://localhost:3000/api

---

# Authentication API

## Register User

Create a new user account.

### Endpoint

POST /auth/register

### Request Body

json
{
"name": "John Doe",
"email": "john@email.com",
"confirmEmail": "john@email.com",
"password": "123456"
"confirmPassword": "123456"
}

### Response (201)

json
{
"token": "JWT_TOKEN",
"userId": 1
}

### Errors

json
{
"message": "User already exist"
}

---

# Login User

Authenticate existing user.

### Endpoint

POST /auth/login

### Request Body

json
{
"email": "john@email.com",
"password": "123456"
}

### Response (200)

json
{
"data": {
"token": "JWT_TOKEN",
"userId": 1
}
}

### Errors

json
{
"message": "Invalid credentials"
}

---

# Get Current User

Returns information about the authenticated user.

### Endpoint

GET /auth/me

### Headers

Authorization: Bearer JWT_TOKEN

### Response (200)

json
{
"user": {
"id": 1,
"name": "John Doe",
"email": "john@email.com",
"role": "user"
}
}

### Errors

json
{
"message": "Invalid token"
}

---

# Health Check

Check if backend server is running.

### Endpoint

GET /health

### Response

json
{
"status": "OK",
"message": "BackEnd working"
}

=========\***\*\*\*\*\*\***==========
=========\***\*\*\*\*\*\***==========
=========\***\*\*\*\*\*\***==========

Products API

GET /products

Admin only ...
POST /products
PUT /products/:id
DELETE /products/:id

Orders API -- admin only
