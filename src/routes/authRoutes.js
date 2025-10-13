
const express = require('express')
const userControllers = require('../controllers/userControllers')

const userRoutes = express.Router()

userRoutes.post(
  '/register-patient',
  userControllers.signUpPatient
)

userRoutes.post('/login', userControllers.loginUser)

module.exports = userRoutes
