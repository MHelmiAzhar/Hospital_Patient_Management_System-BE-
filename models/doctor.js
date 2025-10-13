'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        targetKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Doctor.hasMany(models.Appointment, {
        foreignKey: 'doctor_id',
        as: 'appointments',
        sourceKey: 'doctor_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Doctor.init({
    doctor_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    specialization: DataTypes.STRING,
    schedule: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Doctor',
    tableName: 'tb_doctors',
    timestamps: true,
  });
  return Doctor;
};