const Joi = require('joi');
const appointment = require('../../../../models/appointment');

const createAppointmentSchema = Joi.object({
    patient_user_id: Joi.number().integer().required(),
    doctor_user_id: Joi.number().integer().required(),
    date: Joi.date().iso().required(),
});

const updateAppointmentSchema = Joi.object({
    doctor_user_id: Joi.number().integer().required(),
    date: Joi.date().iso().required(),
});

const updateAppointmentAdminSchema = Joi.object({
    doctor_user_id: Joi.number().integer().required(),
    date: Joi.date().iso().required(),
    status: Joi.string().valid('SCHEDULED','APPROVED', 'REJECTED', 'COMPLETED').optional().allow(''),
});

const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string().valid('SCHEDULED','APPROVED', 'REJECTED', 'COMPLETED').required(),
});

const queryParamSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(10),
  date: Joi.date().iso().optional().allow(''),
  status: Joi.string().valid('SCHEDULED','APPROVED', 'REJECTED', 'COMPLETED').optional().allow(''),
  appointment_id: Joi.number().integer().optional(),
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  queryParamSchema,
  updateAppointmentAdminSchema
};