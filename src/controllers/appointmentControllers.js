const { createAppointmentSchema, updateAppointmentStatusSchema, updateAppointmentSchema, queryParamSchema, updateAppointmentAdminSchema } = require('../commons/helper/schemas/appointment');
const { resSuccessHandler, resErrorHandler } = require('../commons/exceptions/resHandler');
const appointmentServices = require('../services/appointmentServices');
const dtoValidation = require('../commons/helper/dtoValidation');
const ClientError = require('../commons/exceptions/ClientError');

const createAppointment = async (req, res, next) => {
    try {
        const { patient_user_id, doctor_user_id, date } = await dtoValidation(req.body, createAppointmentSchema);
        
        // Validasi: date must be greater than now (WIB)
        if (!date) {
            throw new ClientError('Date is required');
        }

        const nowUTC = new Date();
        const nowWIB = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);

        const appointmentDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

        if (appointmentDate <= nowWIB) {
            throw new ClientError('Date must be greater than now (WIB)');
        }

        const appointment = await appointmentServices.createAppointment({ patient_user_id, doctor_user_id, date:appointmentDate });

        return resSuccessHandler(res, appointment, 'Appointment created successfully', 201);
    } catch (error) {
        return resErrorHandler(res, error);
    }
};

const updateAppointment = async (req, res, next) => {
    try {
        const { user_id: patient_user_id, role } = req.user;
        const { id: appointment_id } = req.params;
        if (!appointment_id) throw new ClientError('Parameter ID is required');

        const { doctor_user_id, date, status } = await dtoValidation(req.body, updateAppointmentSchema);

        // Validasi: date must be greater than now (WIB)
        if (!date) {
            throw new ClientError('Date is required');
        }

        const nowUTC = new Date();
        const nowWIB = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);

         const appointmentDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

        if (appointmentDate <= nowWIB) {
            throw new ClientError('Date must be greater than now (WIB)');
        }

        const appointment = await appointmentServices.updateAppointment({ appointment_id, patient_user_id, doctor_user_id, date: appointmentDate, role, status });

        return resSuccessHandler(res, appointment, 'Appointment updated successfully', 200);
    } catch (error) {
        return resErrorHandler(res, error);
    }
};
const updateAppointmentAdmin = async (req, res, next) => {
    try {
        const { id: appointment_id } = req.params;
        if (!appointment_id) throw new ClientError('Parameter ID is required');

        const { doctor_user_id, date, status } = await dtoValidation(req.body, updateAppointmentAdminSchema);

        // Validasi: date must be greater than now (WIB)
        if (!date) {
            throw new ClientError('Date is required');
        }

        const nowUTC = new Date();
        const nowWIB = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);

         const appointmentDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

        if (appointmentDate <= nowWIB) {
            throw new ClientError('Date must be greater than now (WIB)');
        }

        const appointment = await appointmentServices.updateAppointmentByAdmin({ appointment_id, doctor_user_id, date: appointmentDate, status });

        return resSuccessHandler(res, appointment, 'Appointment updated successfully', 200);
    } catch (error) {
        return resErrorHandler(res, error);
    }
};

const getAppointments = async (req, res, next) => {
    try {
        const { page, size, date, status, appointment_id } = await dtoValidation(req.query, queryParamSchema);
        const { role, user_id } = req.user; 
        const data = await appointmentServices.getAppointments({ page, size, role, userId: user_id, date, status, appointment_id });
        return resSuccessHandler(res, data, 'Appointments retrieved successfully');
    } catch (error) {
        return resErrorHandler(res, error);
    }
};

const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = await dtoValidation(req.body, updateAppointmentStatusSchema);
       
        await appointmentServices.updateAppointmentStatus(id, status);
        return resSuccessHandler(res, null, 'Appointment status updated successfully');
    } catch (error) {
        return resErrorHandler(res, error);
    }
};

const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role, user_id } = req.user;
        await appointmentServices.deleteAppointment(id, { role,user_id });
        return resSuccessHandler(res, null, 'Appointment deleted successfully');
    } catch (error) {
        return resErrorHandler(res, error);
    }
};

module.exports = {
    createAppointment,
    updateAppointment,
    getAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    updateAppointmentAdmin
};