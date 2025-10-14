const { User, Patient, Doctor } = require('../../models');
const { Op } = require('sequelize');

const checkEmailExists = async (email) => {
    return await User.findOne(
        { where: { email } }, 
    );
}

const getUserById = async (user_id) => {
    return await User.findOne(
        { where: { user_id }, include: [
            { model: Patient, as: 'patient' },
            { model: Doctor, as: 'doctor' }
        ] }
    );
}

const createUser = async ({name, email, password, role}, t) => {
    return await User.create(
        { name, email, password, role },
        { transaction: t }
    );
}

const createPatient = async ({address, birth_date, gender, contact_number, user_id}, t) => {
    return await Patient.create(
        { address, birth_date, gender, contact_number, user_id },
        { transaction: t }
    );
}

const createDoctor = async ({specialization, user_id}, t) => {
    return await Doctor.create(
        { specialization, user_id },
        { transaction: t }
    );
}

const updateUser = async (user_id, { name, email }, t) => {
    return await User.update(
        { name, email },
        { where: { user_id }, transaction: t }
    );
}

const updateDoctor = async (user_id, { specialization }, t) => {
    return await Doctor.update(
        { specialization },
        { where: { user_id }, transaction: t }
    );
}

const updatePatient = async (user_id, { address, birth_date, gender, contact_number }, t) => {
    return await Patient.update(
        { address, birth_date, gender, contact_number },
        { where: { user_id }, transaction: t }
    );
}

const deleteUser = async (user_id, t) => {
    return await User.destroy(
        { where: { user_id }, transaction: t }
    );
}

const getAllUsers = async ({ limit, offset, search, role }) => {
    const whereClause = {
        role: { [Op.in]: ['DOCTOR', 'PATIENT'] }
    };
    if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
    }
    if (role) {
        whereClause.role = role;
    }

    return await User.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        include: [
            { model: Patient, as: 'patient' },
            { model: Doctor, as: 'doctor' }
        ]
    });
}

module.exports = {
    checkEmailExists,
    createUser,
    createPatient,
    createDoctor,
    updateUser,
    updateDoctor,
    deleteUser,
    updatePatient,
    getUserById,
    getAllUsers,
};
