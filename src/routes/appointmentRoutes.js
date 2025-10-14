const express = require('express');
const appointmentControllers = require('../controllers/appointmentControllers');
const { authenticate, requireRole } = require('../commons/middleware/auth');

const appointmentRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */

// Create an appointment (Patient or Admin)
appointmentRoutes.post(
  '/',
  authenticate,
  requireRole('PATIENT', 'ADMIN'),
  appointmentControllers.createAppointment
);

/**
 * @swagger
 * /api/v1/appointment:
 *   post:
 *     summary: Create appointment (PATIENT or ADMIN)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               doctor_id:
 *                 type: integer
 *               date:
 *                 type: string
 *               complaint:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *
 *   get:
 *     summary: List appointments, include result of examination if any, filtered by logged user (pagination, search, filter by date/status)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *
 * /api/v1/appointment/{id}:
 *   put:
 *     summary: Update appointment (PATIENT or ADMIN)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               date:
 *                 type: string
 *               complaint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *
 *   delete:
 *     summary: Delete appointment (ADMIN)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment deleted
 *
 * /api/v1/appointment/{id}/status:
 *   patch:
 *     summary: Update status (DOCTOR/ADMIN)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */

// Update an appointment (Patient or Admin)
appointmentRoutes.put(
  '/:id',
  authenticate,
  requireRole('PATIENT', 'ADMIN'),
  appointmentControllers.updateAppointment
);

// Get all appointments (filtered by role)
appointmentRoutes.get(
  '/',
  authenticate,
  appointmentControllers.getAppointments
);

// Update appointment status (Doctor or Admin)
appointmentRoutes.patch(
  '/:id/status',
  authenticate,
  requireRole('DOCTOR', 'ADMIN'),
  appointmentControllers.updateAppointmentStatus
);

// Delete an appointment (Admin only)
appointmentRoutes.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'PATIENT'),
  appointmentControllers.deleteAppointment
);

module.exports = appointmentRoutes;