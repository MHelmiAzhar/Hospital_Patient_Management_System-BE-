'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    return queryInterface.bulkInsert('tb_users', [
      {
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tb_users', { email: process.env.ADMIN_EMAIL || 'admin@example.com' }, {});
  }
};
