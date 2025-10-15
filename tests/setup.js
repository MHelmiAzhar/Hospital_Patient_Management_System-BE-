// Test configuration
require('dotenv').config();

// Override environment for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.DB_NAME = 'hospital_management_test';

// Set longer timeout for database operations
jest.setTimeout(30000);
