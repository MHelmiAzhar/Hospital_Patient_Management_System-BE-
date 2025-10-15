const { sequelize } = require('../../models');
const ClientError = require('../commons/exceptions/ClientError');
const NotFoundError = require('../commons/exceptions/NotFoundError');
const { createPagination } = require('../commons/helper/pagination');
const appointmentRepositories = require('../repositories/appointmentRepositories');
const userRepositories = require('../repositories/userRepositories');

const createAppointment = async ({ patient_user_id, doctor_user_id, date }) => {
    const patient = await userRepositories.getUserById(patient_user_id);
    if (!patient || patient.role !== 'PATIENT') {
        throw new NotFoundError('Patient not found');
    }
    
    const doctor = await userRepositories.getUserById(doctor_user_id);
    if (!doctor || doctor.role !== 'DOCTOR') {
        throw new NotFoundError('Doctor not found');
    }

    const newAppointment = await appointmentRepositories.createAppointment({
        patient_user_id,
        doctor_user_id,
        date,
        status: 'SCHEDULED',
    });

    return newAppointment;
};

const updateAppointment = async ({ appointment_id, patient_user_id, doctor_user_id, date, role }) => {
    // Check Appointment
    const appointment = await appointmentRepositories.getAppointmentById(appointment_id);
    if (!appointment) {
        throw new NotFoundError('Appointment not found');
    }
    if (role === 'PATIENT' && appointment.patient_user_id !== patient_user_id) {
        throw new ClientError('You are not authorized to update this appointment');
    }
    if (appointment.status !== 'SCHEDULED') {
        throw new ClientError('Only SCHEDULED appointments can be updated');
    }

    // Check Patient
     const patient = await userRepositories.getUserById(patient_user_id);
    if (!patient || patient.role !== 'PATIENT') {
        throw new NotFoundError('Patient not found');
    }

    const doctor = await userRepositories.getUserById(doctor_user_id);
    if (!doctor || doctor.role !== 'DOCTOR') {
        throw new NotFoundError('Doctor not found');
    }


    const newAppointment = await appointmentRepositories.updateAppointment({
        appointment_id,
        patient_user_id,
        doctor_user_id,
        date,
        status: 'SCHEDULED',
    });

    return newAppointment;
};
const updateAppointmentByAdmin = async ({ appointment_id, doctor_user_id, date, status }) => {
    // Check Appointment
    const appointment = await appointmentRepositories.getAppointmentById(appointment_id);
    if (!appointment) {
        throw new NotFoundError('Appointment not found');
    }
  
    // Check Doctor
    const doctor = await userRepositories.getUserById(doctor_user_id);
    if (!doctor || doctor.role !== 'DOCTOR') {
        throw new NotFoundError('Doctor not found');
    }


    const newAppointment = await appointmentRepositories.updateAppointment({
        appointment_id,
        doctor_user_id,
        date,
        status,
    });

    return newAppointment;
};

const getAppointments = async ({ page = 1, size = 10, role, userId, date, status, appointment_id }) => {
  const pageNum = parseInt(page, 10);
  const pageSize = parseInt(size, 10);
  const limit = pageSize;
  const offset = (pageNum - 1) * pageSize;

  const { count, rows } = await appointmentRepositories.getAllAppointments({ limit, offset, role, userId, date, status, appointment_id });

  const pagination = createPagination(pageNum, pageSize, count);

  return { pagination, appointments: rows };
};

const updateAppointmentStatus = async (appointment_id, status) => {
    const t = await sequelize.transaction();
    try {
        const appointment = await appointmentRepositories.getAppointmentById(appointment_id);
        if (!appointment) {
            throw new NotFoundError('Appointment not found');
        }

        await appointmentRepositories.updateAppointment({ appointment_id, status }, t);
        await t.commit();
        return true;
    } catch (error) {
        if (t) await t.rollback();
        throw error;
    }
};

const deleteAppointment = async (appointment_id, {role, user_id }) => {
    const t = await sequelize.transaction();
    try {
         // Check Appointment
        const appointment = await appointmentRepositories.getAppointmentById(appointment_id);
        if (!appointment) {
            throw new NotFoundError('Appointment not found');
        }
        if (role === 'PATIENT' && appointment.patient_user_id !== user_id) {
            throw new ClientError('You are not authorized to update this appointment');
        }
        if (appointment.status !== 'SCHEDULED') {
            throw new ClientError('Only SCHEDULED appointments can be updated');
        }
        await appointmentRepositories.deleteAppointment(appointment_id, t);
        await t.commit();
        return true;
    } catch (error) {
        if (t) await t.rollback();
        throw error;
    }
};

module.exports = {
  createAppointment,
  updateAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  updateAppointmentByAdmin
};