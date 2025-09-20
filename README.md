# Sweet Shop Management System

A full-stack application for managing a sweet shop's inventory, orders, and user authentication. Built with TypeScript, React, Express, and Prisma.

## Features

- 🔐 Secure user authentication and authorization
- 🍬 Sweet inventory management
- 📊 Order tracking and management
- 🎯 Role-based access control
- 📱 Responsive frontend interface
- 📚 API documentation with Swagger

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Jest for testing

### Frontend

- React with TypeScript
- Vite
- Modern CSS
- React Router

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file and configure your variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database connection string and other configurations.

5. Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Documentation

The API documentation is available through Swagger UI when the backend is running:

- URL: `http://localhost:8000/api-docs`

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```


## Development Guidelines

- Follow the established TypeScript configuration
- Write tests for new features
- Document new API endpoints using Swagger JSDoc
- Follow the existing project structure

## License

This project is licensed under the MIT License.
