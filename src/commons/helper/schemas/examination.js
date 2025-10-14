const Joi = require('joi');

const createExaminationSchema = Joi.object({
    appointment_id: Joi.number().integer().required(),
    diagnosis: Joi.string().required(),
    notes: Joi.string().required(),
    treatment: Joi.string().required()
});

module.exports = { createExaminationSchema };