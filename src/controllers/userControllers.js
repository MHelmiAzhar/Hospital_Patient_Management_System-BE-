const ClientError = require("../commons/exceptions/ClientError");
const { resErrorHandler, resSuccessHandler } = require("../commons/exceptions/resHandler");
const dtoValidation = require("../commons/helper/dtoValidation");
const { signUpPatientSchema, loginSchema, createDoctorSchema, updateDoctorSchema, updatePatientSchema, queryAllUsersSchema, queryAllDoctorsSchema } = require("../commons/helper/schemas/user");
const userServices = require("../services/userServices");

const signUpPatient = async (req, res) => {
    try {
        const { name, email, password, address, birth_date, gender, contact_number } = await dtoValidation(req.body, signUpPatientSchema);

        const user = await userServices.signUpPatient(name, email, password, address, birth_date, gender, contact_number);

        return resSuccessHandler(res, user, 'Patient created successfully', 201);
    } catch (error) {
        resErrorHandler(res, error);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = await dtoValidation(req.body, loginSchema);

        const user = await userServices.loginUser(email, password);

        return resSuccessHandler(res, user, 'User logged in successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}

const createDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization } = await dtoValidation(req.body, createDoctorSchema);

        const user = await userServices.createDoctor(name, email, password, specialization);

        return resSuccessHandler(res, user, 'Doctor created successfully', 201);
    } catch (error) {
        resErrorHandler(res, error);
    }
}

const updateDoctor = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { role: userRole, user_id: userId } = req.user;

        if (!user_id) throw new ClientError('Parameter ID is required');
        if (userRole !== 'ADMIN' && userId !== Number(user_id)) throw new ClientError('You are not authorized to update this doctor');

        const { name, email, specialization } = await dtoValidation(req.body, updateDoctorSchema);
        await userServices.updateDoctor(user_id, { name, email, specialization });

        return resSuccessHandler(res, null, 'Doctor updated successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}

const updatePatient = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { role: userRole, user_id: userId } = req.user;

        if (!user_id) throw new ClientError('Parameter ID is required');
        if (userRole !== 'ADMIN' && userId !== Number(user_id)) throw new ClientError('You are not authorized to update this patient');
        if (userRole !== 'ADMIN') delete req.body.role;

        const { name, email, address, birth_date, gender, contact_number } = await dtoValidation(req.body, updatePatientSchema);
        const user = await userServices.updatePatient(user_id, { name, email, address, birth_date, gender, contact_number });

        return resSuccessHandler(res, null, 'Patient updated successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const { user_id } = req.params;

        await userServices.deleteDoctor(user_id);

        return resSuccessHandler(res, null, 'Doctor deleted successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}

const deletePatient = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { role: userRole, user_id: userId } = req.user;

        if (!user_id) throw new ClientError('Parameter ID is required');
        if (userRole !== 'ADMIN' && userId !== Number(user_id)) throw new ClientError('You are not authorized to delete this patient');

        await userServices.deletePatient(user_id);

        return resSuccessHandler(res, null, 'Patient deleted successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const { page, size, search, role } = await dtoValidation(req.query, queryAllUsersSchema);
        const users = await userServices.getPaginatedUsers({ page, size, search, role });
        return resSuccessHandler(res, users, 'Users retrieved successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}
const getAllDoctors = async (req, res) => {
    try {
        const { page, size, search } = await dtoValidation(req.query, queryAllDoctorsSchema);
        const users = await userServices.getPaginatedUsers({ page, size, search, role: "DOCTOR" });
        return resSuccessHandler(res, users, 'Doctors retrieved successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}
const getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id) throw new ClientError('Parameter ID is required');

        const user = await userServices.getUserById(user_id);
        return resSuccessHandler(res, user, 'User retrieved successfully', 200);
    } catch (error) {
        resErrorHandler(res, error);
    }
}
module.exports = {
    signUpPatient,
    loginUser,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    updatePatient,
    deletePatient,
    getAllUsers,
    getUserById,
    getAllDoctors
};