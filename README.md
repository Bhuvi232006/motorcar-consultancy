# MotorCar Consultancy - MongoDB Integration

A car consultancy website with MongoDB backend for handling form submissions and data storage.

## Features

- **Static Frontend**: HTML/CSS/JS car consultancy website
- **MongoDB Integration**: Stores consultation requests, service selections, and contact forms
- **REST API**: Express.js server with POST endpoints for form submissions
- **Data Models**: Structured schemas for customer data and requests

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup MongoDB**
   - **Local MongoDB**: Install and start MongoDB service
   - **MongoDB Atlas**: Create cluster and get connection string

3. **Environment Configuration**
   ```bash
   # Copy .env file and update MongoDB connection string
   # Default: mongodb://localhost:27017/motorcar_consultancy
   ```

## Running the Application

### Development Mode
```bash
# Start the Express server with MongoDB integration
npm run dev
```

### Production Mode
```bash
# Start the production server
npm start
```

The application will be available at:
- **Website**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

## API Endpoints

### POST Routes (Form Submissions)

#### Service Selection
```http
POST /api/select-service
Content-Type: application/json

{
  "service": "auto-expert",
  "timestamp": "2025-11-05T10:30:00Z"
}
```

#### Checkout Form
```http
POST /api/checkout
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+91-9876543210",
  "pincode": "110001",
  "service": "auto-expert",
  "totalAmount": 200,
  "carDetails": {
    "budget": "10-15 lakhs",
    "carType": "SUV",
    "fuelType": "Petrol"
  },
  "additionalInfo": "Looking for family car"
}
```

#### Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91-9876543210",
  "subject": "General Inquiry",
  "message": "I need help choosing a car"
}
```

### GET Routes (Data Retrieval)

#### Get All Consultation Requests
```http
GET /api/consultation-requests
```

#### Get Specific Request
```http
GET /api/consultation-requests/:id
```

#### Health Check
```http
GET /api/health
```

## Testing POST Requests

### Using curl
```bash
# Test service selection
curl -X POST http://localhost:3000/api/select-service \
  -H "Content-Type: application/json" \
  -d '{"service": "auto-expert", "timestamp": "2025-11-05T10:30:00Z"}'

# Test checkout form
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com", 
    "whatsapp": "+91-9876543210",
    "service": "auto-expert",
    "totalAmount": 200
  }'
```

## Development

- **Frontend**: Static files served from Express
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB with structured collections
- **Environment**: Development/Production configurations
