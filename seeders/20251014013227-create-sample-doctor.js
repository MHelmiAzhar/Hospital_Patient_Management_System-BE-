'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const doctorsData = [
        {
          name: 'Anisa Putri',
          email: 'anisa.doctor@example.com',
          specialization: 'Pediatrics',
        },
        {
          name: 'Rian Hidayat',
          email: 'rian.doctor@example.com',
          specialization: 'Cardiology',
        },
        {
          name: 'Dewi Anggraini',
          email: 'dewi.doctor@example.com',
          specialization: 'Dermatology',
        },
      ];

      for (const doctor of doctorsData) {
        const shortName = doctor.name.split(' ')[0].toLowerCase();
        const hashedPassword = await bcrypt.hash(shortName, 10);

        // 1️⃣ Insert ke tb_users
        await queryInterface.bulkInsert('tb_users', [{
          name: doctor.name,
          email: doctor.email,
          password: hashedPassword,
          role: 'DOCTOR',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });

        // 2️⃣ Ambil user_id dari tb_users
        const [results] = await queryInterface.sequelize.query(
          `SELECT user_id FROM tb_users WHERE email = :email LIMIT 1`,
          {
            replacements: { email: doctor.email },
            transaction: t,
          }
        );

        const userId = results[0]?.user_id;
        if (!userId) throw new Error(`User ID not found for ${doctor.email}`);

        // 3️⃣ Insert ke tb_doctors
        await queryInterface.bulkInsert('tb_doctors', [{
          specialization: doctor.specialization,
          user_id: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Seeder failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const doctorEmails = [
      'anisa.doctor@example.com',
      'rian.doctor@example.com',
      'dewi.doctor@example.com'
    ];

    await queryInterface.bulkDelete(
      'tb_users',
      { email: { [Sequelize.Op.in]: doctorEmails } },
      {}
    );
  },
};
