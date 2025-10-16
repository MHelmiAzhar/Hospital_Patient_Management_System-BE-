const { Appointment, User, Doctor } = require('../../models');
const { Op } = require('sequelize');

const createAppointment = async ({ patient_user_id, doctor_user_id, date, status }) => {
    return await Appointment.create({ patient_user_id, doctor_user_id, date, status });
};

const getAppointmentById = async (appointment_id) => {
    return await Appointment.findOne({ where: { appointment_id }});
}

const getAllAppointments = async ({ limit, offset, role, userId, date, status, appointment_id }) => {
    const whereClause = {};

    // Filter by appointment status
    if (status) {
        whereClause.status = status;
    }

    // Filter by appointment date
    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        whereClause.date = {
            [Op.between]: [startDate, endDate],
        };
    }

    // Filter by user role and userId
    if (role === 'PATIENT') {
        whereClause.patient_user_id = userId;
    } else if (role === 'DOCTOR') {
        whereClause.doctor_user_id = userId;
    }

    if (appointment_id) {
        whereClause.appointment_id = appointment_id;
    }

    return await Appointment.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        include: [
            {
                model: User,
                as: 'patient',
                attributes: ['user_id', 'name', 'email', 'role'],
            },
            {
                model: User,
                as: 'doctor',
                attributes: ['user_id', 'name', 'email', 'role'],
                include: [{
                    model: Doctor, as: 'doctor', attributes: ['specialization'],
                }]
            },
        ],
        distinct: true,
    });
};

const updateAppointment = async ({ appointment_id, patient_user_id, doctor_user_id, date, status }, t) => {
    return await Appointment.update({ patient_user_id, doctor_user_id, date, status }, {
        where: { appointment_id },
        transaction: t,
    });
};

const deleteAppointment = async (appointment_id, t) => {
    return await Appointment.destroy({
        where: { appointment_id },
        transaction: t,
  });
};

module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  getAppointmentById
};