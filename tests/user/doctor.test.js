const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../../models');
const userRoutes = require('../../src/routes/userRoutes');
const {
  createAdminToken,
  mockDoctorData,
  cleanDatabase,
  createTestAdmin,
  createTestDoctor
} = require('../helpers/testHelpers');

// Setup Express app for testing
const app = express();
app.use(bodyParser.json());
app.use('/api/v1/user', userRoutes);

describe('Doctor CRUD Operations by Admin', () => {
  let adminToken;
  let testAdmin;

  // Setup before all tests
  beforeAll(async () => {
    // Sync database
    await db.sequelize.sync({ force: true });
    
    // Create test admin
    testAdmin = await createTestAdmin(db);
    
    // Generate tokens
    adminToken = createAdminToken(testAdmin.user_id);
  });

  // Cleanup after each test
  afterEach(async () => {
    // Clean up created doctors except test admin
    await db.Doctor.destroy({ where: {} });
    await db.User.destroy({ 
      where: { 
        role: 'DOCTOR' 
      } 
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    await cleanDatabase(db);
    await db.sequelize.close();
  });

  // ==================== CREATE DOCTOR TESTS ====================
  describe('POST /api/v1/user/create-doctor', () => {
    
    test('Should create doctor successfully with valid admin token', async () => {
      const response = await request(app)
        .post('/api/v1/user/create-doctor')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockDoctorData.valid);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.data).toHaveProperty('user_id');
      expect(response.body.data.name).toBe(mockDoctorData.valid.name);
      expect(response.body.data.email).toBe(mockDoctorData.valid.email);
      expect(response.body.data.role).toBe('DOCTOR');
      expect(response.body.data).toHaveProperty('specialization');
      expect(response.body.data.specialization).toBe(mockDoctorData.valid.specialization);
      expect(response.body.message).toContain('created successfully');
      
      // Password should not be returned
      expect(response.body.data.password).toBeUndefined();
      
      // Store created doctor ID for other tests
      createdDoctorId = response.body.data.user_id;
    });

  });

  // ==================== GET/LIST DOCTORS TESTS ====================
  describe('GET /api/v1/user/all-doctor', () => {
    
    beforeEach(async () => {
      // Create multiple test doctors
      await createTestDoctor(db, {
        name: 'Dr. Alice',
        email: 'alice@test.com',
        specialization: 'Cardiology'
      });
      
      await createTestDoctor(db, {
        name: 'Dr. Bob',
        email: 'bob@test.com',
        specialization: 'Neurology'
      });
      
      await createTestDoctor(db, {
        name: 'Dr. Charlie',
        email: 'charlie@test.com',
        specialization: 'Pediatrics'
      });
    });

    test('Should get all doctors with valid admin token', async () => {
      const response = await request(app)
        .get('/api/v1/user/all-doctor')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data.users).toBeInstanceOf(Array);
      expect(response.body.data.users.length).toBeGreaterThan(0);
      expect(response.body.data).toHaveProperty('pagination');
      
      // Check doctor data structure
      const doctor = response.body.data.users[0];
      expect(doctor).toHaveProperty('user_id');
      expect(doctor).toHaveProperty('name');
      expect(doctor).toHaveProperty('email');
      expect(doctor.role).toBe('DOCTOR');
      expect(doctor).toHaveProperty('specialization');
    });

    test('Should get all doctors with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/user/all-doctor?page=1&size=2')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.itemsPerPage).toBe(2);
      expect(response.body.data.users.length).toBeLessThanOrEqual(2);
    });

    
  });

  // ==================== GET DOCTOR BY ID TESTS ====================
  describe('GET /api/v1/user/detail/:user_id', () => {
    let testDoctor;

    beforeEach(async () => {
      testDoctor = await createTestDoctor(db, {
        name: 'Dr. Test Detail',
        email: 'detail@test.com',
        specialization: 'Dermatology'
      });
    });

    test('Should get doctor details by ID with valid admin token', async () => {
      const response = await request(app)
        .get(`/api/v1/user/detail/${testDoctor.user.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data.user_id).toBe(testDoctor.user.user_id);
      expect(response.body.data.name).toBe('Dr. Test Detail');
      expect(response.body.data.email).toBe('detail@test.com');
      expect(response.body.data.role).toBe('DOCTOR');
      expect(response.body.data.specialization).toBe('Dermatology');
    });

  });

  // ==================== UPDATE DOCTOR TESTS ====================
  describe('PUT /api/v1/user/update-doctor/:user_id', () => {
    let testDoctor;

    beforeEach(async () => {
      testDoctor = await createTestDoctor(db, {
        name: 'Dr. Original Name',
        email: 'original@test.com',
        specialization: 'Original Specialty'
      });
    });

    test('Should update doctor successfully with valid admin token', async () => {
      // Prepare update data with the SAME email as the doctor being updated
      const updateData = {
        name: 'Dr. Original Name Updated',
        email: 'original@test.com', // Same email as testDoctor
        specialization: 'Updated Specialty'
      };

      const response = await request(app)
        .put(`/api/v1/user/update-doctor/${testDoctor.user.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toContain('updated successfully');

      // Verify update by fetching doctor details
      const verifyResponse = await request(app)
        .get(`/api/v1/user/detail/${testDoctor.user.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(verifyResponse.body.data.name).toBe(updateData.name);
      expect(verifyResponse.body.data.specialization).toBe(updateData.specialization);
    });
  });

  // ==================== DELETE DOCTOR TESTS ====================
  describe('DELETE /api/v1/user/delete-doctor/:user_id', () => {
    let testDoctor;

    beforeEach(async () => {
      testDoctor = await createTestDoctor(db, {
        name: 'Dr. To Delete',
        email: 'delete@test.com',
        specialization: 'Test Specialty'
      });
    });

    test('Should delete doctor successfully with valid admin token', async () => {
      const response = await request(app)
        .delete(`/api/v1/user/delete-doctor/${testDoctor.user.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify doctor is deleted
      const checkResponse = await request(app)
        .get(`/api/v1/user/detail/${testDoctor.user.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(checkResponse.status).toBe(400);
      expect(checkResponse.body.message).toContain('User not found');
    });
  });
});
