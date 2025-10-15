const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Generate JWT token for testing
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

/**
 * Create admin token
 */
const createAdminToken = (userId = 1) => {
  return generateToken({
    user_id: userId,
    email: 'admin@test.com',
    role: 'ADMIN'
  });
};

/**
 * Hash password for testing
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Mock doctor data
 */
const mockDoctorData = {
  valid: {
    name: 'Dr. John Smith',
    email: 'john.smith@test.com',
    password: 'password123',
    specialization: 'Cardiology'
  },
  update: {
    name: 'Dr. John Smith Updated',
    email: 'john.smith.updated@test.com',
    specialization: 'Cardiology & Internal Medicine'
  },
};

/**
 * Clean up database tables for testing
 */
const cleanDatabase = async (models) => {
  await models.Appointment.destroy({ where: {}, force: true });
  await models.Doctor.destroy({ where: {}, force: true });
  await models.Patient.destroy({ where: {}, force: true });
  await models.User.destroy({ where: {}, force: true });
};

/**
 * Create test admin user
 */
const createTestAdmin = async (models) => {
  const hashedPassword = await hashPassword('admin123');
  const user = await models.User.create({
    name: 'Admin Test',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'ADMIN'
  });
  return user;
};

/**
 * Create test doctor user
 */
const createTestDoctor = async (models, customData = {}) => {
  const hashedPassword = await hashPassword('doctor123');
  const user = await models.User.create({
    name: customData.name || 'Dr. Test',
    email: customData.email || 'doctor@test.com',
    password: hashedPassword,
    role: 'DOCTOR'
  });
  
  const doctor = await models.Doctor.create({
    user_id: user.user_id,
    specialization: customData.specialization || 'General Medicine'
  });
  
  return { user, doctor };
};

/**
 * Create test patient user
 */
const createTestPatient = async (models, customData = {}) => {
  const hashedPassword = await hashPassword('patient123');
  const user = await models.User.create({
    name: customData.name || 'Patient Test',
    email: customData.email || 'patient@test.com',
    password: hashedPassword,
    role: 'PATIENT'
  });
  
  const patient = await models.Patient.create({
    user_id: user.user_id,
    address: customData.address || 'Test Address',
    birth_date: customData.birth_date || '1990-01-01',
    gender: customData.gender || 'MALE',
    contact_number: customData.contact_number || '081234567890'
  });
  
  return { user, patient };
};

module.exports = {
  generateToken,
  createAdminToken,
  hashPassword,
  mockDoctorData,
  cleanDatabase,
  createTestAdmin,
  createTestDoctor,
  createTestPatient
};
