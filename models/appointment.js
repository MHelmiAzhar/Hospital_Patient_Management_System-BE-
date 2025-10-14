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
      Appointment.belongsTo(models.User, {
        foreignKey: 'patient_user_id',
        as: 'patient',
      });

      Appointment.belongsTo(models.User, {
        foreignKey: 'doctor_user_id',
        as: 'doctor',
      });

      Appointment.hasOne(models.Examination, {
        foreignKey: 'appointment_id',
        as: 'examination',
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
    patient_user_id: DataTypes.INTEGER,
    doctor_user_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    status: DataTypes.ENUM('SCHEDULED', 'APPROVED', 'REJECTED', 'COMPLETED')
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'tb_appointments',
    timestamps: true,
  });
  return Appointment;
};