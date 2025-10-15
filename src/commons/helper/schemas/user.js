const Joi = require('joi');

const signUpPatientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().max(255).required(),
  birth_date: Joi.date().required(),
  gender: Joi.string().valid('MALE', 'FEMALE').required(),
  contact_number: Joi.string().max(15).required(),
})

const updatePatientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(255).required(),
  birth_date: Joi.date().required(),
  gender: Joi.string().valid('MALE', 'FEMALE').required(),
  contact_number: Joi.string().max(15).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  specialization: Joi.string().max(100).required(),
});

const updateDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  specialization: Joi.string().max(100).required(),
});

const queryAllUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).allow(''),
  role: Joi.string().valid('DOCTOR', 'PATIENT'),
});
const queryAllDoctorsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).allow(''),
});


module.exports = { 
  signUpPatientSchema, 
  updatePatientSchema, 
  loginSchema, 
  createDoctorSchema, 
  updateDoctorSchema,
  queryAllUsersSchema,
  queryAllDoctorsSchema
}
