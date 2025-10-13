'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('tb_patients', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_patients_user_id',
      references: {
        table: 'tb_users',
        field: 'user_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('tb_doctors', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_doctors_user_id',
      references: {
        table: 'tb_users',
        field: 'user_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('tb_appointments', {
      fields: ['patient_id'],
      type: 'foreign key',
      name: 'fk_appointments_patient_id',
      references: {
        table: 'tb_patients',
        field: 'patient_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('tb_appointments', {
      fields: ['doctor_id'],
      type: 'foreign key',
      name: 'fk_appointments_doctor_id',
      references: {
        table: 'tb_doctors',
        field: 'doctor_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('tb_examinations', {
      fields: ['appointment_id'],
      type: 'foreign key',
      name: 'fk_examinations_appointment_id',
      references: {
        table: 'tb_appointments',
        field: 'appointment_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tb_patients', 'fk_patients_user_id');
    await queryInterface.removeConstraint('tb_doctors', 'fk_doctors_user_id');
    await queryInterface.removeConstraint('tb_appointments', 'fk_appointments_patient_id');
    await queryInterface.removeConstraint('tb_appointments', 'fk_appointments_doctor_id');
    await queryInterface.removeConstraint('tb_examinations', 'fk_examinations_appointment_id');
  }
};
