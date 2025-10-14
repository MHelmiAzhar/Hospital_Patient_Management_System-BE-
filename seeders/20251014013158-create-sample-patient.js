'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const patientsData = [
        {
          name: 'Budi Santoso',
          email: 'budi.patient@example.com',
          address: 'Jl. Merdeka 1',
          birth_date: '1990-05-15',
          gender: 'MALE',
          contact_number: '081234567890'
        },
        {
          name: 'Citra Lestari',
          email: 'citra.patient@example.com',
          address: 'Jl. Pahlawan 2',
          birth_date: '1995-08-20',
          gender: 'FEMALE',
          contact_number: '081234567891'
        },
        {
          name: 'Eko Prasetyo',
          email: 'eko.patient@example.com',
          address: 'Jl. Sudirman 3',
          birth_date: '1988-11-30',
          gender: 'MALE',
          contact_number: '081234567892'
        },
      ];

      for (const patient of patientsData) {
        const shortName = patient.name.split(' ')[0].toLowerCase();
        const hashedPassword = await bcrypt.hash(shortName, 10);

        // 1️⃣ Insert ke tb_users
        await queryInterface.bulkInsert('tb_users', [{
          name: patient.name,
          email: patient.email,
          password: hashedPassword,
          role: 'PATIENT',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });

        // 2️⃣ Ambil user_id yang baru dibuat
        const [results] = await queryInterface.sequelize.query(
          `SELECT user_id FROM tb_users WHERE email = :email LIMIT 1`,
          {
            replacements: { email: patient.email },
            transaction: t,
          }
        );

        const userId = results[0]?.user_id;
        if (!userId) throw new Error(`User ID not found for ${patient.email}`);

        // 3️⃣ Insert ke tb_patients
        await queryInterface.bulkInsert('tb_patients', [{
          address: patient.address,
          birth_date: new Date(patient.birth_date),
          gender: patient.gender,
          contact_number: patient.contact_number,
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
    const patientEmails = [
      'budi.patient@example.com',
      'citra.patient@example.com',
      'eko.patient@example.com',
    ];

    await queryInterface.bulkDelete(
      'tb_users',
      { email: { [Sequelize.Op.in]: patientEmails } },
      {}
    );
  },
};
