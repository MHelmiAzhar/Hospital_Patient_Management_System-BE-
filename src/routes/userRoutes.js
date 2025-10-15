const express = require('express')
const userControllers = require('../controllers/userControllers')
const { authenticate, requireRole } = require('../commons/middleware/auth')

const userRoutes = express.Router()

userRoutes.post('/create-doctor', authenticate, requireRole('ADMIN'), userControllers.createDoctor)
userRoutes.put('/update-doctor/:user_id', authenticate, requireRole('ADMIN', "DOCTOR"), userControllers.updateDoctor)
userRoutes.put('/update-patient/:user_id', authenticate, requireRole('ADMIN', "PATIENT"), userControllers.updatePatient)
userRoutes.delete('/delete-doctor/:user_id', authenticate, requireRole('ADMIN'), userControllers.deleteDoctor)
userRoutes.delete('/delete-patient/:user_id', authenticate, requireRole('ADMIN', "PATIENT"), userControllers.deletePatient)
userRoutes.get('/detail/:user_id', authenticate, userControllers.getUserById)
userRoutes.get('/all-doctor', authenticate, userControllers.getAllDoctors)
userRoutes.get('/', authenticate, requireRole('ADMIN'), userControllers.getAllUsers)


module.exports = userRoutes


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/user/create-doctor:
 *   post:
 *     summary: Create doctor (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. Ahmad Rizki"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ahmad.doctor@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               specialization:
 *                 type: string
 *                 example: "Cardiology"
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 65
 *                         name:
 *                           type: string
 *                           example: "Dr. Ahmad Rizki"
 *                         email:
 *                           type: string
 *                           example: "ahmad.doctor@example.com"
 *                         role:
 *                           type: string
 *                           example: "DOCTOR"
 *                         specialization:
 *                           type: string
 *                           example: "Cardiology"
 *                 message:
 *                   type: string
 *                   example: "Doctor created successfully"
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Not an admin
 *       409:
 *         description: Conflict - Email already exists
 *       500:
 *         description: Internal server error
 *
 * /api/v1/user/update-doctor/{user_id}:
 *   put:
 *     summary: Update profile doctor (ADMIN or DOCTOR)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               specialization:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated
 *
 * /api/v1/user/update-patient/{user_id}:
 *   put:
 *     summary: Update profile patient (ADMIN or PATIENT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               birth_date:
 *                 type: string
 *               gender:
 *                 type: string
 *               contact_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated
 *
 * /api/v1/user/delete-doctor/{user_id}:
 *   delete:
 *     summary: Delete doctor (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor deleted
 *
 * /api/v1/user/delete-patient/{user_id}:
 *   delete:
 *     summary: Delete patient (ADMIN or PATIENT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient deleted
 *
 * /api/v1/user/:
 *   get:
 *     summary: List all users, Doctor and Patient (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [PATIENT, DOCTOR]
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: List of users with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                           example: 26
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         itemsPerPage:
 *                           type: integer
 *                           example: 10
 *                     users:
 *                       type: array
 *                       items:
 *                         oneOf:
 *                           - type: object
 *                             properties:
 *                               user_id:
 *                                 type: integer
 *                                 example: 17
 *                               name:
 *                                 type: string
 *                                 example: "Citra Lestari"
 *                               email:
 *                                 type: string
 *                                 example: "citra.patient@example.com"
 *                               role:
 *                                 type: string
 *                                 example: "PATIENT"
 *                               address:
 *                                 type: string
 *                                 example: "Jl. Pahlawan 2"
 *                               birth_date:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "1995-08-20T00:00:00.000Z"
 *                               gender:
 *                                 type: string
 *                                 enum: [MALE, FEMALE]
 *                                 example: "FEMALE"
 *                               contact_number:
 *                                 type: string
 *                                 example: "081234567891"
 *                           - type: object
 *                             properties:
 *                               user_id:
 *                                 type: integer
 *                                 example: 21
 *                               name:
 *                                 type: string
 *                                 example: "Dr. Dewi Anggraini Suci"
 *                               email:
 *                                 type: string
 *                                 example: "dewi.doctor@example.com"
 *                               role:
 *                                 type: string
 *                                 example: "DOCTOR"
 *                               specialization:
 *                                 type: string
 *                                 example: "Dermatology"
 *                 message:
 *                   type: string
 *                   example: "Users fetched successfully"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Not an admin
 *       500:
 *         description: Internal server error
 *
 * /api/v1/user/all-doctor:
 *   get:
 *     summary: Get all doctors (All authenticated users)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by doctor name or specialization
 *     responses:
 *       200:
 *         description: List of all doctors with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                           example: 15
 *                         totalPages:
 *                           type: integer
 *                           example: 2
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         itemsPerPage:
 *                           type: integer
 *                           example: 10
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                             example: 21
 *                           name:
 *                             type: string
 *                             example: "Dr. Dewi Anggraini Suci"
 *                           email:
 *                             type: string
 *                             example: "dewi.doctor@example.com"
 *                           role:
 *                             type: string
 *                             example: "DOCTOR"
 *                           specialization:
 *                             type: string
 *                             example: "Dermatology"
 *                 message:
 *                   type: string
 *                   example: "Doctors fetched successfully"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 *
 * /api/v1/user/detail/{user_id}:
 *   get:
 *     summary: Get user by ID (All authenticated users)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       description: Patient data
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 17
 *                         name:
 *                           type: string
 *                           example: "Citra Lestari"
 *                         email:
 *                           type: string
 *                           example: "citra.patient@example.com"
 *                         role:
 *                           type: string
 *                           example: "PATIENT"
 *                         address:
 *                           type: string
 *                           example: "Jl. Pahlawan 2"
 *                         birth_date:
 *                           type: string
 *                           format: date-time
 *                           example: "1995-08-20T00:00:00.000Z"
 *                         gender:
 *                           type: string
 *                           enum: [MALE, FEMALE]
 *                           example: "FEMALE"
 *                         contact_number:
 *                           type: string
 *                           example: "081234567891"
 *                     - type: object
 *                       description: Doctor data
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 21
 *                         name:
 *                           type: string
 *                           example: "Dr. Dewi Anggraini Suci"
 *                         email:
 *                           type: string
 *                           example: "dewi.doctor@example.com"
 *                         role:
 *                           type: string
 *                           example: "DOCTOR"
 *                         specialization:
 *                           type: string
 *                           example: "Dermatology"
 *                 message:
 *                   type: string
 *                   example: "User fetched successfully"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

