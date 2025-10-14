const { sequelize } = require('../../models');
const { createOrUpdateExamination } = require('../repositories/examinationRepositories');
const NotFoundError = require('../commons/exceptions/NotFoundError');
const appointmentRepositories = require('../repositories/appointmentRepositories');
const ClientError = require('../commons/exceptions/ClientError');

const saveExaminationResult = async ({ appointment_id, diagnosis, notes, treatment, doctor_user_id }) => {
    const t = await sequelize.transaction();
    try {
        // Check if the appointment exists
        const appointment = await appointmentRepositories.getAppointmentById(appointment_id);
        if(!appointment) {
            throw new NotFoundError('Appointment not found');
        }
        
        if(appointment.status !== 'APPROVED') {
            throw new ClientError('Examination can only be added to APPROVED appointments');
        }
        // Check if the appointment date is today or in the past (patient has met the doctor)
        const appointmentDate = new Date(appointment.date);
        const nowUTC = new Date();
        const nowWIB = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);
        if (appointmentDate > nowWIB) {
            throw new ClientError('Examination can only be added after the patient has met the doctor');
        }

        // Check appointment doctor_user_id is same as the user making the request
        if(appointment.doctor_user_id !== doctor_user_id) {
            throw new ClientError('You are not authorized to add examination result to this appointment');
        }

        //check if examination for the appointment already exists
        if(appointment.examination) {
            throw new ClientError('Examination for this appointment already exists');
        }

        const examination = await createOrUpdateExamination({ appointment_id, diagnosis, notes, treatment }, t);
        await t.commit();
        return examination;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

module.exports = { saveExaminationResult };