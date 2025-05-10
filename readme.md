# Masterclass: Refactoring Backend asistido por IA
## Order Management API

This is a backend project developed with Node.js, Express and MongoDB that implements a REST API for order management.

## Technologies Used

- Node.js
- Express
- MongoDB
- TypeScript
- Jest (for testing)

## Prerequisites

- Node.js (version 20 or higher)
- npm or yarn as package manager
- MongoDB running locally or remotely (connection string is hardcoded in app.ts, you may want to adapt it to your environment)

For MongoDB installation, follow the instructions at:
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

## Installation & Setup

1. Clone the repository or download source code
2. In the root folder, run:

   ```bash
   npm install
   ```

## Running the Application

Development mode with auto-reload:

```bash
npm run dev
```

## Running Tests

```bash
npm test
```

## API Endpoints
- `GET /` - Health check endpoint
- `POST /orders` - Create a new order
- `GET /orders` - Get all orders
- `PUT /orders/:id` - Update an order
- `POST /orders/:id/complete` - Complete an order
- `DELETE /orders/:id` - Delete an order

