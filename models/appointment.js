'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
        targetKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Appointment.belongsTo(models.Doctor, {
        foreignKey: 'doctor_id',
        as: 'doctor',
        targetKey: 'doctor_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Appointment.hasOne(models.Examination, {
        foreignKey: 'appointment_id',
        as: 'examination',
        sourceKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Appointment.init({
    appointment_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    patient_id: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    status: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'tb_appointments',
    timestamps: true,
  });
  return Appointment;
};