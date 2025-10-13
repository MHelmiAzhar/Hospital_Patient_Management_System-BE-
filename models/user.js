'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A user can have one patient record (when role = 'PATIENT')
      User.hasOne(models.Patient, {
        foreignKey: 'user_id',
        as: 'patient',
        sourceKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      User.hasOne(models.Doctor, {
        foreignKey: 'user_id',
        as: 'doctor',
        sourceKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('ADMIN', 'DOCTOR', 'PATIENT')

  }, {
    sequelize,
    modelName: 'User',
    tableName: 'tb_users',
    timestamps: true,
  });
  return User;
};