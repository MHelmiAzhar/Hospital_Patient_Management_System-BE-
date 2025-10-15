const express = require('express')
const userControllers = require('../controllers/userControllers')

const userRoutes = express.Router()

userRoutes.post(
  '/register-patient',
  userControllers.signUpPatient
)

userRoutes.post('/login', userControllers.loginUser)

module.exports = userRoutes


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register-patient:
 *   post:
 *     summary: Register for patient, returns JWT
 *     tags: [Auth]
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
 *               - contact_number
 *               - address
 *               - birth_date
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               contact_number:
 *                 type: string
 *                 example: "081234567890"
 *               address:
 *                 type: string
 *                 example: "Jl. Kesehatan No. 123"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "2001-10-10"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: "MALE"
 *     responses:
 *       200:
 *         description: Patient registered successfully with JWT token
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
 *                           example: 64
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "johndoe@gmail.com"
 *                         address:
 *                           type: string
 *                           example: "Jl. Kesehatan No. 123"
 *                         birth_date:
 *                           type: string
 *                           format: date-time
 *                           example: "2001-10-09T17:00:00.000Z"
 *                         gender:
 *                           type: string
 *                           enum: [MALE, FEMALE]
 *                           example: "MALE"
 *                         contact_number:
 *                           type: string
 *                           example: "081234567890"
 *                         role:
 *                           type: string
 *                           example: "PATIENT"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2NCwiZW1haWwiOiJzdHJpbmdAZ21haWwuY29tIiwicm9sZSI6IlBBVElFTlQiLCJpYXQiOjE3NjA1MjE0MDQsImV4cCI6MTc2MDYwNzgwNH0.olYc8-Crj6ZDhcPP_Vy0LzfXOFlZ6US9DPaxQq6fZVA"
 *                 message:
 *                   type: string
 *                   example: "Patient created successfully"
 *       400:
 *         description: Bad request - Invalid input data
 *       409:
 *         description: Conflict - Email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login All Users (Admin, Doctor, Patient), return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully with JWT token
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
 *                           example: 64
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "johndoe@gmail.com"
 *                         role:
 *                           type: string
 *                           enum: [ADMIN, DOCTOR, PATIENT]
 *                           example: "PATIENT"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2NCwiZW1haWwiOiJzdHJpbmdAZ21haWwuY29tIiwicm9sZSI6IlBBVElFTlQiLCJpYXQiOjE3NjA1MjE0NjcsImV4cCI6MTc2MDYwNzg2N30.6_IyyuQzgpzlr17mbtZvt_d_nNmHhkfmz0i6QQK0is4"
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *       400:
 *         description: Bad request - Missing email or password
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

