
const express = require('express')
const userControllers = require('../controllers/userControllers')
const { authenticate, requireRole } = require('../commons/middleware/auth')
const user = require('../../models/user')

const userRoutes = express.Router()

userRoutes.post('/create-doctor', authenticate, requireRole('ADMIN'), userControllers.createDoctor)
userRoutes.put('/update-doctor/:user_id', authenticate, requireRole('ADMIN', "DOCTOR"), userControllers.updateDoctor)
userRoutes.put('/update-patient/:user_id', authenticate, requireRole('ADMIN', "PATIENT"), userControllers.updatePatient)
userRoutes.delete('/delete-doctor/:user_id', authenticate, requireRole('ADMIN'), userControllers.deleteDoctor)
userRoutes.delete('/delete-patient/:user_id', authenticate, requireRole('ADMIN', "PATIENT"), userControllers.deletePatient)
userRoutes.get('/', authenticate, requireRole('ADMIN'), userControllers.getAllUsers)

module.exports = userRoutes
