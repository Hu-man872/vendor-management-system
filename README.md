# vendor-management-system

Overview

The Vendor Management System is a web application built using Node.js, Express.js, and JSON Web Tokens (JWT) for secure vendor management. It allows businesses to efficiently manage vendor data, track transactions, and handle authentication.

Features

User Authentication (Login, Signup) with JWT

CRUD Operations for Vendors

Role-Based Access Control (Admin & User)

Secure API Endpoints

Error Handling & Validation


Tech Stack

Backend: Node.js, Express.js

Authentication: JSON Web Token (JWT)

Database: MongoDB (or MySQL/PostgreSQL, if applicable)


API Endpoints

Authentication

POST /api/auth/register – Register a new user

POST /api/auth/login – Login and receive a JWT


Vendors

GET /api/vendors – Get all vendors

POST /api/vendors – Add a new vendor

GET /api/vendors/:id – Get a specific vendor

PUT /api/vendors/:id – Update vendor details

DELETE /api/vendors/:id – Delete a vendor


Usage

1. Register or log in to obtain a JWT token.


2. Use the token in the Authorization header for protected routes.


3. Manage vendors by performing CRUD operations.



