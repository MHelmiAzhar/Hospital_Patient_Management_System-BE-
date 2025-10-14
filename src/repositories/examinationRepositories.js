const { Examination, Appointment } = require('../../models');

const createOrUpdateExamination = async ({ appointment_id, diagnosis, notes, treatment }, t) => {
    const examination = await Examination.create(
        { appointment_id, diagnosis, notes, treatment },
        { transaction: t }
    );
    await Appointment.update(
        { status: 'COMPLETED' },
        { where: { appointment_id }, transaction: t }
    );
    return examination;
};

module.exports = { createOrUpdateExamination };