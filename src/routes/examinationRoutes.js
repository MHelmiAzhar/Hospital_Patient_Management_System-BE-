const express = require('express');
const { saveExaminationResult } = require('../controllers/examinationControllers');
const { authenticate, requireRole } = require('../commons/middleware/auth');

const examinationRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Examinations
 *   description: Examination result endpoints
 */

/**
 * @swagger
 * /api/v1/examination:
 *   post:
 *     summary: Create examination result (DOCTOR or ADMIN)
 *     tags: [Examinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_id:
 *                 type: integer
 *               diagnosis:
 *                 type: string
 *               notes:
 *                 type: string
 *               treatment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Examination result created
 */

// Endpoint untuk dokter mengisi hasil pemeriksaan
examinationRoutes.post(
  '/',
  authenticate,
  requireRole('DOCTOR', 'ADMIN'),
  saveExaminationResult
);

module.exports = examinationRoutes;