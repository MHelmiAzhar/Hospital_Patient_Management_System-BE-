# Hospital Appointment Management System - Backend API

RESTful API for Hospital Appointment Management System built with Node.js, Express.js, MySQL, and Sequelize ORM.

## 🚀 Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Three user roles: ADMIN, DOCTOR, PATIENT
- Secure password hashing with bcrypt

### User Management

- Admin can create, update, delete doctors and patients
- Doctors can update their own profile
- Patients can register, update their own profile
- User listing with pagination and search

### Appointment Management

- Patients can create, update, delete appointments
- Doctors can approve/reject/complete appointments
- Admin has full control over appointments
- Filter by date, status, and search
- Pagination support

### API Documentation

- Swagger UI documentation
- Available at `/api-docs`
- Interactive API testing

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **MySQL** - Relational database
- **Sequelize 6** - ORM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Swagger** - API documentation
- **Joi** - Input validation
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variables

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🔧 Installation

1. Navigate to the backend directory:

```bash
cd be
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the `be` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_management
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. Create MySQL database:

```sql
CREATE DATABASE hospital_management;
```

5. Run database migrations:

```bash
npx sequelize-cli db:migrate
```

6. (Optional) Seed initial data:

```bash
npx sequelize-cli db:seed:all
```

This will create:

- 1 Admin user
- Sample doctors
- Sample patients

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
be/
├── config/
│   └── config.js              # Database configuration
├── migrations/                # Sequelize migrations
│   ├── *-create-user.js
│   ├── *-create-patient.js
│   ├── *-create-doctor.js
│   └── *-create-appointment.js
├── models/                    # Sequelize models
│   ├── index.js
│   ├── user.js
│   ├── patient.js
│   ├── doctor.js
│   └── appointment.js
├── seeders/                   # Database seeders
│   ├── *-create-admin-user.js
│   ├── *-create-sample-patient.js
│   └── *-create-sample-doctor.js
├── src/
│   ├── app.js                 # Application entry point
│   ├── commons/
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication & authorization
│   │   ├── exceptions/        # Custom error classes
│   │   │   ├── AuthenticationError.js
│   │   │   ├── AuthorizationError.js
│   │   │   ├── ClientError.js
│   │   │   ├── InternalServerError.js
│   │   │   ├── NotFoundError.js
│   │   │   └── resHandler.js  # Response handler
│   │   ├── swagger.js         # Swagger configuration
│   │   └── helper/            # Utility functions
│   ├── controllers/           # Request handlers
│   │   ├── userControllers.js
│   │   └── appointmentControllers.js
│   ├── repositories/          # Database layer
│   │   ├── userRepositories.js
│   │   └── appointmentRepositories.js
│   ├── services/              # Business logic layer
│   │   ├── userServices.js
│   │   └── appointmentServices.js
│   └── routes/                # API routes
│       ├── authRoutes.js      # Authentication endpoints
│       ├── userRoutes.js      # User management
│       └── appointmentRoutes.js
├── .env                       # Environment variables (not in git)
├── .gitignore
├── package.json
└── README.md
```

## 🌐 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register Patient

```http
POST /api/v1/auth/register-patient
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "contact_number": "081234567890",
  "address": "Jl. Example No. 123",
  "birth_date": "1990-01-15",
  "gender": "MALE"
}
```

#### Login (All Users)

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    "user": {
      "user_id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully"
}
```

### User Management Endpoints (Protected)

All user management endpoints require `Authorization: Bearer <token>` header.

#### Create Doctor (ADMIN only)

```http
POST /api/v1/user/create-doctor
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Sarah Johnson",
  "email": "sarah@example.com",
  "password": "password123",
  "specialization": "Cardiology"
}
```

#### Get All Users (ADMIN only)

```http
GET /api/v1/user/?page=1&size=10&role=PATIENT&search=john
Authorization: Bearer <token>
```

#### Get All Doctors (All authenticated users)

```http
GET /api/v1/user/all-doctor?page=1&size=10
Authorization: Bearer <token>
```

#### Get User by ID

```http
GET /api/v1/user/detail/1
Authorization: Bearer <token>
```

#### Update Doctor Profile

```http
PUT /api/v1/user/update-doctor/5
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Sarah Johnson Updated",
  "specialization": "Cardiology & Internal Medicine"
}
```

#### Update Patient Profile

```http
PUT /api/v1/user/update-patient/10
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "address": "New Address",
  "contact_number": "081234567899"
}
```

#### Delete Doctor (ADMIN only)

```http
DELETE /api/v1/user/delete-doctor/5
Authorization: Bearer <token>
```

#### Delete Patient (ADMIN or PATIENT themselves)

```http
DELETE /api/v1/user/delete-patient/10
Authorization: Bearer <token>
```

### Appointment Endpoints (Protected)

#### Create Appointment (PATIENT or ADMIN)

```http
POST /api/v1/appointment
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient_user_id": 64,
  "doctor_user_id": 21,
  "date": "2025-10-17T08:00:00"
}
```

#### Get Appointments (All authenticated users)

```http
GET /api/v1/appointment?page=1&size=10&date=2025-10-17&status=SCHEDULED
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `size` - Items per page (default: 10)
- `date` - Filter by date (YYYY-MM-DD)
- `status` - Filter by status (SCHEDULED, APPROVED, REJECTED, COMPLETED)
- `appointment_id` - Get specific appointment

**Response includes:**

- Appointment details
- Patient information
- Doctor information

#### Update Appointment (PATIENT)

```http
PUT /api/v1/appointment/23
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-10-18T09:00:00",
  "doctor_user_id": 21
}
```

#### Update Appointment (ADMIN)

```http
PUT /api/v1/appointment/23/admin
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-10-18T10:00:00",
  "doctor_user_id": 21,
  "status": "APPROVED"
}
```

#### Update Appointment Status (DOCTOR)

```http
PATCH /api/v1/appointment/23/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"
}
```

**Allowed statuses:** APPROVED, REJECTED, COMPLETED

#### Delete Appointment (ADMIN or PATIENT owner)

```http
DELETE /api/v1/appointment/23
Authorization: Bearer <token>
```

## 📚 API Documentation (Swagger)

Access interactive API documentation:

```
http://localhost:3000/api-docs
```

Swagger UI provides:

- Complete API reference
- Request/response schemas
- Try-it-out functionality
- Authentication support

## 🔐 Authentication & Authorization

### JWT Token

After successful login, you'll receive a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use this token in the `Authorization` header for protected routes:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User Roles & Permissions

#### ADMIN

- Full access to all endpoints
- Create, update, delete doctors and patients
- Manage all appointments
- View all users

#### DOCTOR

- View appointments assigned to them
- Approve/reject/complete appointments
- Update own profile

#### PATIENT

- Register and manage own profile
- Create and manage own appointments
- View own appointment history

## 🗄️ Database Schema

### User Table

- `user_id` (PK)
- `name`
- `email` (unique)
- `password` (hashed)
- `role` (ADMIN, DOCTOR, PATIENT)

### Patient Table

- `patient_id` (PK)
- `user_id` (FK to User)
- `address`
- `birth_date`
- `gender` (MALE, FEMALE)
- `contact_number`

### Doctor Table

- `doctor_id` (PK)
- `user_id` (FK to User)
- `specialization`

### Appointment Table

- `appointment_id` (PK)
- `patient_user_id` (FK to User)
- `doctor_user_id` (FK to User)
- `date`
- `status` (SCHEDULED, APPROVED, REJECTED, COMPLETED)

## 🧪 Seeded Data

After running seeders, you'll have:

### Admin Account

```
Email: admin@example.com
Password: admin123
Role: ADMIN
```

### Sample Doctor

```
Email: doctor@example.com
Password: doctor123
Role: DOCTOR
Specialization: General Medicine
```

### Sample Patient

```
Email: patient@example.com
Password: patient123
Role: PATIENT
```

## 🐛 Error Handling

The API uses standardized error responses:

### Success Response

```json
{
  "status": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "status": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (Invalid/missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

## 🔧 Environment Variables

Required environment variables in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_management
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=3000
NODE_ENV=development
```

## 📝 Development Guidelines

### Code Style

- Use consistent naming conventions
- Follow MVC + Repository pattern
- Separate business logic from route handlers
- Use async/await for asynchronous operations

### Layered Architecture

1. **Routes** - Define endpoints and middleware
2. **Controllers** - Handle requests and responses
3. **Services** - Business logic layer
4. **Repositories** - Database operations
5. **Models** - Sequelize ORM models

### Adding New Features

1. Create migration:

```bash
npx sequelize-cli migration:generate --name create-new-table
```

2. Define model in `models/`
3. Create repository in `repositories/`
4. Create service in `services/`
5. Create controller in `controllers/`
6. Define routes in `routes/`
7. Add Swagger documentation

## 🧪 Testing

### Prerequisites

Before running tests, you need to:

1. Install test dependencies:

```bash
npm install
```

2. Create test database:

```sql
CREATE DATABASE hospital_management_test;
```

3. Update `.env` file to include test database configuration (optional - defaults to `hospital_management_test`):

```env
# Test Database
DB_NAME_TEST=hospital_management_test
```

### Running Tests

#### Run all tests

```bash
npm test
```

This will run all tests with coverage report.

#### Run tests in watch mode

```bash
npm run test:watch
```

Useful for development - automatically reruns tests when files change.

#### Run specific test suite

```bash
npm run test:doctor
```

Runs only the doctor CRUD tests.

#### Run with coverage

```bash
npm test
```

Coverage reports will be generated in the `coverage/` directory.

### Test Structure

```
tests/
├── setup.js                    # Test configuration
├── helpers/
│   └── testHelpers.js          # Test utilities
└── user/
    └── doctor.test.js          # Doctor CRUD tests
```

### Available Test Suites

#### Doctor CRUD Tests (`tests/user/doctor.test.js`)

Tests for doctor management by admin:

- **CREATE**: Test doctor creation with valid data
- **READ**: Test listing doctors with pagination/search, get doctor details
- **UPDATE**: Test updating doctor information
- **DELETE**: Test deleting doctors

### Test Coverage

The test suite covers:

- ✅ Authentication & Authorization (JWT tokens for ADMIN)
- ✅ Success scenarios (happy path)
- ✅ Database operations (create, read, update, delete)
- ✅ Pagination and search functionality

### Writing New Tests

When adding new tests:

1. Create test file in `tests/` directory following the naming convention `*.test.js`
2. Import test helpers from `tests/helpers/testHelpers.js`
3. Use provided utilities:
   - `createAdminToken()` - Generate admin JWT token
   - `mockDoctorData` - Pre-defined test data
   - `cleanDatabase()` - Clean up test data
   - `createTestAdmin()`, `createTestDoctor()`, `createTestPatient()` - Create test users

Example:

```javascript
const request = require('supertest')
const { createAdminToken, cleanDatabase } = require('../helpers/testHelpers')

describe('My Test Suite', () => {
  let adminToken

  beforeAll(async () => {
    adminToken = createAdminToken(1)
  })

  afterAll(async () => {
    await cleanDatabase(db)
  })

  test('Should do something', async () => {
    const response = await request(app)
      .get('/api/v1/endpoint')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
  })
})
```

### Test Database

Tests use a separate database (`hospital_management_test`) to avoid affecting development data. The test database is:

- Created automatically by the test setup
- Synchronized before each test suite
- Cleaned up after tests complete

**⚠️ Warning**: Never run tests against production database!

### Troubleshooting Tests

#### Tests hang or timeout

- Check database connections are properly closed
- Ensure `afterAll()` includes `await db.sequelize.close()`
- Increase Jest timeout in `tests/setup.js`

#### Database errors

- Verify test database exists
- Check database credentials in `.env`
- Ensure migrations are run on test database

#### Token/Authentication errors

- Verify `JWT_SECRET` is set in environment
- Check token format matches authentication middleware expectations

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit a pull request

## 📄 License

Private - Siloam Hospital Interview Project

## 👥 Authors

- Backend Developer - Hospital Appointment Management System

## 📞 Support

For issues and questions, please contact the development team.

## 🔗 Related Resources

- [Sequelize Documentation](https://sequelize.org/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)
- [Swagger Documentation](https://swagger.io/)
