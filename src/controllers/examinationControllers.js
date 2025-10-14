const { createExaminationSchema } = require('../commons/helper/schemas/examination');
const { resSuccessHandler, resErrorHandler } = require('../commons/exceptions/resHandler');
const examinationServices = require('../services/examinationServices');
const dtoValidation = require('../commons/helper/dtoValidation');

const saveExaminationResult = async (req, res) => {
  try {
        const { appointment_id, diagnosis, notes, treatment } = await dtoValidation(req.body, createExaminationSchema);
        const { user_id: doctor_user_id } = req.user;

        const result = await examinationServices.saveExaminationResult({ appointment_id, diagnosis, notes, treatment, doctor_user_id });

        return resSuccessHandler(res, result, 'Examination result saved');
    } catch (err) {
        return resErrorHandler(res, err);
  }
};

module.exports = { saveExaminationResult };