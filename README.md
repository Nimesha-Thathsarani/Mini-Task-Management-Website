# Mini Task Management System

A full-stack, aesthetically modern web application built with **Next.js 15 (App Router, Tailwind v4)** for the frontend and **Spring Boot 3 (Java 17)** for the backend. 

## Project Overview

This project is a mini task management software where users can register, login, and securely manage their tasks.
- **Role-Based Access Control:** Standard users can manage their own tasks. Admin users can view all tasks across the system.
- **JWT Authentication:** Stateful and secure tokens handled via HTTP intercepts.
- **Modern UI:** Vibrant gradients, glassmorphism UI elements, strict spacing, and high-performance micro-interactions.
- **Features:** Create, Read, Update, Delete (CRUD), pagination, and filtering across Statuses and Priorities.

## Prerequisites
- Node.js (v18+)
- Java 17+ (JDK)
- Maven 3.8+
- MySQL Server (Port 3306)

## Database Configuration (MySQL)

By default, the application tries to connect to `jdbc:mysql://localhost:3306/minitask` with username `root` and password `root`.
You can change these options in your environment variables, or run the following SQL initially:

CREATE DATABASE minitask;

For the exact schema representation, refer to `schema.sql` at the root of this project. Note that Hibernate's `ddl-auto=update` is enabled, so Spring Boot will automatically generate the tables based on the JPA entities if you prefer.

### Required Environment Variables
If you change default setups or deploy this, these environment variables are configurable in the Spring Boot `.env` or system:
- `DB_URL`: JDBC Database String
- `DB_USERNAME`: MySQL Username
- `DB_PASSWORD`: MySQL Password
- `JWT_SECRET`: Base64 Encoded Secret Key for Tokens
- `JWT_EXPIRATION_MS`: Token duration (Default: 86400000 -> 1 Day)



## Steps to Run the Application

### 1. Run the Backend Server
Open a terminal in the `backend/` directory:

cd backend
./mvnw spring-boot:run

The Spring Boot backend will start on **`http://localhost:8080`**.

### 2. View API Documentation
With the backend running, the API documentation is automatically generated using Swagger UI. Visit:
- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### 3. Run the Frontend Development Server
Open a separate terminal in the `frontend/` directory:

cd frontend
npm run dev

The Next.js frontend will start on **`http://localhost:3000`**. 

Open your browser to [http://localhost:3000](http://localhost:3000) and you will automatically be directed to the authentication flow! Enjoy exploring the vibrant user interface and managing your tasks efficiently.
