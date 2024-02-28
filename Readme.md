# E-Commerce API Documentation

## Introduction

This is an API for an e-commerce platform built using Prisma ORM MySql, Express, Bcrypt, Midtrans, Node Cache. It provides various endpoints for managing users, products, categories, orders, and more.

## Getting Started

To get started with this API, follow these steps:

1. Clone the repository:

```
git clone <repository-url>
```

## Install dependencies:

```
npm install
```

## Set up your environment variables by creating a .env file and adding the following variables:

```
DATABASE_URL="mysql://username:password@localhost:3306/yourdatabase"

# JWT secret key
JWT_SECRET=secret
JWT_EXPIRES_IN="2h"

# Server port
APP_PORT=5000

# Bcrypt rounds
BCRYPT_ROUNDS=12

# Raja Ongkir
RAJAONGKIR_API_KEY="9dcf4e6fda59ae56b9a79e1718631454"

# Midtrans API
MIDTRANS_API_KEY="U0ItTWlkLXNlcnZlci1yc1V0R3Ztb0xPRGVrYl9ROEJaS2daQTM="
```

## Run the server:

```
npm start
```

# Role Admin

## Categories

- **Browse:** Allow browsing through categories.
- **Read:** Access to view category details.
- **Edit:** Permission to modify category information.
- **Add:** Capability to add new categories.
- **Delete:** Ability to remove categories from the system.

## Products

- **Browse:** Allow browsing through products.
- **Read:** Access to view product details.
- **Edit:** Permission to modify product information.
- **Add:** Capability to add new products.
- **Delete:** Ability to remove products from the system.

## Orders

- **Browse:** Allow browsing through orders.
- **Read:** Access to view order details.
- **Edit:** Permission to modify order information.
- **Add:** Capability to add new orders.
- **Delete:** Ability to remove orders from the system.

## Users

- **Browse:** Allow browsing through users.
- **Read:** Access to view user details.
- **Edit:** Permission to modify user information.
- **Add:** Capability to add new users.

# Role User

## Products

- **Browse:** Allow browsing through products.
- **Read:** Access to view product details.

## Categories

- **Browse:** Allow browsing through categories.
- **Read:** Access to view category details.

## Users

- **Browse:** Allow browsing through users.
- **Read:** Access to view user details.
- **Edit:** Permission to modify user information.

## Carts

- **Browse:** Allow browsing through carts.
- **Read:** Access to view cart details.
- **Edit:** Permission to modify cart contents.
- **Add:** Capability to add items to the cart.
- **Delete:** Ability to remove items from the cart.

## Orders

- **Read:** Access to view order details.
- **Add:** Capability to place new orders.

## Payments

- **Add:** Capability to add payment information for orders.

## Authentication Routes

### Login

- **URL:** `/login`
- **Method:** POST
- **Description:** Authenticates users based on email and password.

## Cart Routes

### Add to Cart

- **URL:** `/cart`
- **Method:** POST
- **Description:** Adds a product to the user's cart.

### View Cart

- **URL:** `/cart`
- **Method:** GET
- **Description:** Retrieves the user's cart.

### Update Cart

- **URL:** `/cart/:id`
- **Method:** PUT
- **Description:** Updates a product in the user's cart.

### Delete from Cart

- **URL:** `/cart/:id`
- **Method:** DELETE
- **Description:** Removes a product from the user's cart.

## Category Routes

### Create Category

- **URL:** `/category`
- **Method:** POST
- **Description:** Creates a new category.

### Get All Categories

- **URL:** `/category`
- **Method:** GET
- **Description:** Retrieves all categories.

### Get Category by ID

- **URL:** `/category/:id`
- **Method:** GET
- **Description:** Retrieves a category by its ID.

### Update Category

- **URL:** `/category/:id`
- **Method:** PUT
- **Description:** Updates a category by its ID.

### Delete Category

- **URL:** `/category/:id`
- **Method:** DELETE
- **Description:** Deletes a category by its ID.

## Destination Routes

### Get Provinces

- **URL:** `/provinces`
- **Method:** GET
- **Description:** Retrieves a list of provinces.

### Get Cities by Province ID

- **URL:** `/cities/:id`
- **Method:** GET
- **Description:** Retrieves a list of cities by province ID.

## Order Routes

### Checkout

- **URL:** `/checkout`
- **Method:** POST
- **Description:** Initiates the checkout process for the user's cart.

### Get User Orders

- **URL:** `/orders`
- **Method:** GET
- **Description:** Retrieves all orders placed by the user.

### Get Order by ID

- **URL:** `/orders/:id`
- **Method:** GET
- **Description:** Retrieves an order by its ID.

## Payment Routes

### POST /webhooks/payment

Endpoint untuk menangani webhook pembayaran.

**Request Body:**

```json
{
  "order_id": "string",
  "transaction_id": "string",
  "transaction_status": "string"
}
```

- `order_id`: ID pesanan yang terkait dengan pembayaran.
- `transaction_id`: ID transaksi dari pembayaran.
- `transaction_status`: Status transaksi pembayaran.

# Response:

- `200 OK` jika berhasil.
- `400 Bad Request` jika body request tidak sesuai.
- `404 Not Found` jika pesanan tidak ditemukan.
- `500 Internal Server` Error jika terjadi kesalahan server.

# POST /pay

## Endpoint untuk melakukan pembayaran.

### Request Body:

```
{
"order_id": "string"
}
```

- `order_id`: ID pesanan yang akan dibayar.

### Response:

- `201 Created` jika pembayaran berhasil.
- `400 Bad Request` jika ID pesanan tidak valid.
- `404 Not Found` jika pesanan tidak ditemukan.
- `500 Internal Server Error` jika terjadi kesalahan server.

# Product Routes

## GET /product

### Endpoint untuk mencari produk berdasarkan nama.

### Query Parameter:

- `name`: Nama produk yang dicari.

### Response:

- Data produk yang sesuai dengan kriteria pencarian.

# GET /product/:id

### Endpoint untuk mendapatkan detail produk berdasarkan ID.

### Response:

- Detail produk yang sesuai dengan ID.

# POST /product

### Endpoint untuk menambahkan produk baru.

### Request Body:

```
{
"name": "string",
"description": "string",
"price": "number",
"category_id": "number",
"quantity": "number",
"rating": "number",
"size": "string",
"weight": "number"
}
```

- Data produk yang akan ditambahkan.

### Response:

- Detail produk yang telah ditambahkan.

# PUT /product/:id

### Endpoint untuk memperbarui produk berdasarkan ID.

### Request Body:

```
{
"name": "string",
"description": "string",
"price": "number",
"category_id": "number",
"quantity": "number",
"rating": "number",
"size": "string",
"weight": "number"
}
```

- Data produk yang akan diperbarui.

### Response:

- Pesan sukses jika produk berhasil diperbarui.

# DELETE /product/:id

### Endpoint untuk menghapus produk berdasarkan ID.

### Response:

- Pesan sukses jika produk berhasil dihapus.

# Other Routes

# GET /user

### Endpoint untuk mendapatkan data pengguna yang sedang masuk.

### Response:

- Detail pengguna yang sedang masuk.

# PUT /edit_user

### Endpoint untuk memperbarui data pengguna yang sedang masuk.

### Request Body:

```
{
"username": "string",
"fullname": "string",
"email": "string",
"password": "string",
"phone": "string",
"role_id": "number",
"membership_id": "number"
}
```
