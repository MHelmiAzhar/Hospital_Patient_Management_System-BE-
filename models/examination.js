'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Examination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Examination.belongsTo(models.Appointment, {
        foreignKey: 'appointment_id',
        as: 'appointment',
        targetKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Examination.init({
    examination_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    appointment_id: DataTypes.INTEGER,
    diagnosis: DataTypes.STRING,
    treatment: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Examination',
    tableName: 'tb_examinations',
    timestamps: true,
  });
  return Examination;
};