const { sequelize } = require('../../models');
const ClientError = require("../commons/exceptions/ClientError");
const { createPagination } = require('../commons/helper/pagination');
const userRepositories = require("../repositories/userRepositories");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUpPatient = async (name, email, password, address, birth_date, gender, contact_number) => {
    const t = await sequelize.transaction();
    try {
        //Check if email already exists
        const existingUser = await userRepositories.checkEmailExists(email);

        if (existingUser) {
            throw new ClientError('Email already in use');  
        }

        //hash password 
        const hashedPassword = bcrypt.hashSync(password, 10);

        // pass hashed password under the `password` key as repository expects
        const user = await userRepositories.createUser({ name, email, password: hashedPassword }, t);
        const patient = await userRepositories.createPatient({ address, birth_date, gender, contact_number, user_id: user.user_id }, t);

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        await t.commit();

        return { 
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                address: patient.address,
                birth_date: patient.birth_date,
                gender: patient.gender,
                contact_number: patient.contact_number,
                role: user.role
            },
            token
        };

    } catch (error) {
        if (t) {
            console.log('Rolling back transaction due to error:', error);
            await t.rollback();
        }
        throw error;
    }
    
}

const loginUser = async (email, password) => {
    const user = await userRepositories.checkEmailExists(email);

    if (!user) {
        throw new ClientError('Invalid email or password');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
        throw new ClientError('Invalid email or password');
    }

    const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { 
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
}

const createDoctor = async (name, email, password, specialization, schedule) => {
    const t = await sequelize.transaction();
    try {
        //Check if email already exists
        const existingUser = await userRepositories.checkEmailExists(email);

        if (existingUser) {
            throw new ClientError('Email already in use');
        }

        //hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // pass hashed password under the `password` key as repository expects
        const user = await userRepositories.createUser({ name, email, password: hashedPassword, role: 'DOCTOR' }, t);

        const doctor = await userRepositories.createDoctor({ specialization, schedule, user_id: user.user_id }, t);
        
        await t.commit();
        return {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            specialization: doctor.specialization,
            schedule: doctor.schedule
        };
        
    } catch (error) {
        if (t) {
            console.log('Rolling back transaction due to error:', error);
            await t.rollback();
        }
        throw error;
    }
}


const updateDoctor = async (user_id, { name, email, specialization, schedule }) => {
    const t = await sequelize.transaction();
    try {
        const doctor = await userRepositories.checkEmailExists(email);
        if(!doctor || doctor.role !== "DOCTOR") throw new ClientError('Doctor not found');

        // Update user information
        await userRepositories.updateUser(user_id, { name, email }, t);
        // Update doctor information
        await userRepositories.updateDoctor(user_id, { specialization, schedule }, t);

        await t.commit();
        return true
    } catch (error) {
        if (t) {
            console.log('Rolling back transaction due to error:', error);
            await t.rollback();
        }
        throw error;
    }
}

const updatePatient = async (user_id, { name, email, address, birth_date, gender, contact_number }) => {
    const t = await sequelize.transaction();
    try {
        const patient = await userRepositories.checkEmailExists(email);
        if(!patient || patient.role !== "PATIENT") throw new ClientError('Patient not found');

        // Update user information
        await userRepositories.updateUser(user_id, { name, email }, t);
        // Update patient information
        await userRepositories.updatePatient(user_id, { address, birth_date, gender, contact_number }, t);

        await t.commit();
        return true
    } catch (error) {
        if (t) {
            console.log('Rolling back transaction due to error:', error);
            await t.rollback();
        }
        throw error;
    }
}

const deleteDoctor = async (user_id) => {
    const t = await sequelize.transaction();
    try {
        const doctor = await userRepositories.getUserById(user_id);
        if(!doctor || doctor.role !== "DOCTOR") throw new ClientError('Doctor not found');

        await userRepositories.deleteUser(user_id, t);
        await t.commit();

        return true;
    } catch (error) {
        if (t) {
            console.log('Rolling back transaction due to error:', error);
            await t.rollback();
        }
        throw error;
    }
}
const deletePatient = async (user_id) => {
    const t = await sequelize.transaction();
    try {
        const patient = await userRepositories.getUserById(user_id);
        if(!patient || patient.role !== "PATIENT") throw new ClientError('Patient not found');

        await userRepositories.deleteUser(user_id, t);
        await t.commit();

        return true;
    } catch (error) {
        if (t) {
            console.log('Rolling back transaction due to error:', error);
            await t.rollback();
        }
        throw error;
    }
}

const getPaginatedUsers = async ({ page = 1, size = 10, search, role }) => {
    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    const { count, rows } = await userRepositories.getAllUsers({
        limit,
        offset,
        search,
        role,
    });

    const pagination = createPagination(pageNum, pageSize, count);

    // Formatting of user data
    const users = rows.map(user => {
        const userData = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        if (user.role === 'PATIENT' && user.patient) {
            Object.assign(userData, {
                address: user.patient.address,
                birth_date: user.patient.birth_date,
                gender: user.patient.gender,
                contact_number: user.patient.contact_number,
            });
        } else if (user.role === 'DOCTOR' && user.doctor) {
            Object.assign(userData, {
                specialization: user.doctor.specialization,
                schedule: user.doctor.schedule,
            });
        }
        return userData;
    });

    return {
        pagination,
        users,
    };
};

module.exports = {
    signUpPatient,
    loginUser,
    createDoctor,
    updateDoctor,
    updatePatient,
    deleteDoctor,
    deletePatient,
    getPaginatedUsers
};
