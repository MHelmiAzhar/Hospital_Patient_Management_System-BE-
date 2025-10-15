const express = require('express');
const appointmentControllers = require('../controllers/appointmentControllers');
const { authenticate, requireRole } = require('../commons/middleware/auth');

const appointmentRoutes = express.Router();

// Create an appointment (Patient or Admin)
appointmentRoutes.post(
  '/',
  authenticate,
  requireRole('PATIENT', 'ADMIN'),
  appointmentControllers.createAppointment
);

// Update an appointment (Patient)
appointmentRoutes.put(
  '/:id',
  authenticate,
  requireRole('PATIENT'),
  appointmentControllers.updateAppointment
);

appointmentRoutes.put(
  '/:id/admin',
  authenticate,
  requireRole('ADMIN'),
  appointmentControllers.updateAppointmentAdmin
);

// Get all appointments (filtered by role)
appointmentRoutes.get(
  '/',
  authenticate,
  appointmentControllers.getAppointments
);

// Update appointment status (Doctor)
appointmentRoutes.patch(
  '/:id/status',
  authenticate,
  requireRole('DOCTOR'),
  appointmentControllers.updateAppointmentStatus
);

// Delete an appointment (Admin only)
appointmentRoutes.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'PATIENT'),
  appointmentControllers.deleteAppointment
);
/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */

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
 *             required:
 *               - patient_user_id
 *               - doctor_user_id
 *               - date
 *             properties:
 *               patient_user_id:
 *                 type: integer
 *                 example: 64
 *               doctor_user_id:
 *                 type: integer
 *                 example: 65
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-17T06:57:31"
 *     responses:
 *       201:
 *         description: Appointment created successfully
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
 *                     appointment_id:
 *                       type: integer
 *                       example: 32
 *                     patient_user_id:
 *                       type: integer
 *                       example: 64
 *                     doctor_user_id:
 *                       type: integer
 *                       example: 65
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-17T06:57:31.000Z"
 *                     status:
 *                       type: string
 *                       example: "SCHEDULED"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-15T10:53:32.782Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-15T10:53:32.782Z"
 *                 message:
 *                   type: string
 *                   example: "Appointment created successfully"
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not PATIENT or ADMIN
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: List appointments, filtered by logged user (pagination, search, filter by date/status)
 *     tags: [Appointments]
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
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, APPROVED, REJECTED, COMPLETED]
 *         description: Filter by status
 *       - in: query
 *         name: appointment_id
 *         schema:
 *           type: integer
 *         description: Get specific appointment by ID
 *     responses:
 *       200:
 *         description: List of appointments
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
 *                           example: 50
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         itemsPerPage:
 *                           type: integer
 *                           example: 10
 *                     appointments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           appointment_id:
 *                             type: integer
 *                             example: 23
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-17T06:57:31.000Z"
 *                           status:
 *                             type: string
 *                             enum: [SCHEDULED, APPROVED, REJECTED, COMPLETED]
 *                             example: "APPROVED"
 *                           patient:
 *                             type: object
 *                             properties:
 *                               user_id:
 *                                 type: integer
 *                                 example: 64
 *                               name:
 *                                 type: string
 *                                 example: "John Doe"
 *                               email:
 *                                 type: string
 *                                 example: "john@example.com"
 *                           doctor:
 *                             type: object
 *                             properties:
 *                               user_id:
 *                                 type: integer
 *                                 example: 21
 *                               name:
 *                                 type: string
 *                                 example: "Dr. Smith"
 *                               specialization:
 *                                 type: string
 *                                 example: "Cardiology"
 *                 message:
 *                   type: string
 *                   example: "Appointments fetched successfully"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /api/v1/appointment/{id}:
 *   put:
 *     summary: Update appointment (PATIENT only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-18T08:00:00"
 *               doctor_user_id:
 *                 type: integer
 *                 example: 65
 *     responses:
 *       200:
 *         description: Appointment updated successfully
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
 *                     appointment_id:
 *                       type: integer
 *                       example: 32
 *                     patient_user_id:
 *                       type: integer
 *                       example: 64
 *                     doctor_user_id:
 *                       type: integer
 *                       example: 65
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-18T08:00:00.000Z"
 *                     status:
 *                       type: string
 *                       example: "SCHEDULED"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-15T11:20:45.123Z"
 *                 message:
 *                   type: string
 *                   example: "Appointment updated successfully"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the appointment owner
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete appointment (ADMIN or PATIENT who owns the appointment)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Appointment deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 * 
 * /api/v1/appointment/{id}/admin:
 *   put:
 *     summary: Update appointment (ADMIN only - can update status)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-18T09:00:00"
 *               doctor_user_id:
 *                 type: integer
 *                 example: 21
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, APPROVED, REJECTED, COMPLETED]
 *                 example: "APPROVED"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
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
 *                     appointment_id:
 *                       type: integer
 *                       example: 32
 *                     patient_user_id:
 *                       type: integer
 *                       example: 64
 *                     doctor_user_id:
 *                       type: integer
 *                       example: 21
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-18T09:00:00.000Z"
 *                     status:
 *                       type: string
 *                       example: "APPROVED"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-15T11:30:22.456Z"
 *                 message:
 *                   type: string
 *                   example: "Appointment updated successfully"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 *
 * /api/v1/appointment/{id}/status:
 *   patch:
 *     summary: Update appointment status (DOCTOR only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED, COMPLETED]
 *                 example: "APPROVED"
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                     appointment_id:
 *                       type: integer
 *                       example: 32
 *                     status:
 *                       type: string
 *                       example: "APPROVED"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-15T11:45:33.789Z"
 *                 message:
 *                   type: string
 *                   example: "Appointment status updated successfully"
 *       400:
 *         description: Bad request - Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a doctor
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */


module.exports = appointmentRoutes;