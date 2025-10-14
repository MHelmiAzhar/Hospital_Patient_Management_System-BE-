const express = require('express')
const userControllers = require('../controllers/userControllers')
const { authenticate, requireRole } = require('../commons/middleware/auth')

const userRoutes = express.Router()

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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               specialization:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created
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
 *     responses:
 *       200:
 *         description: List of users
 */

userRoutes.post('/create-doctor', authenticate, requireRole('ADMIN'), userControllers.createDoctor)
userRoutes.put('/update-doctor/:user_id', authenticate, requireRole('ADMIN', "DOCTOR"), userControllers.updateDoctor)
userRoutes.put('/update-patient/:user_id', authenticate, requireRole('ADMIN', "PATIENT"), userControllers.updatePatient)
userRoutes.delete('/delete-doctor/:user_id', authenticate, requireRole('ADMIN'), userControllers.deleteDoctor)
userRoutes.delete('/delete-patient/:user_id', authenticate, requireRole('ADMIN', "PATIENT"), userControllers.deletePatient)
userRoutes.get('/:user_id', authenticate, userControllers.getUserById)
userRoutes.get('/', authenticate, requireRole('ADMIN'), userControllers.getAllUsers)


module.exports = userRoutes
