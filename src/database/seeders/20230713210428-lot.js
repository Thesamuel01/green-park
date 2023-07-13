'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.bulkInsert('lots', [
      {
        id: 3,
        name: '0017',
        active: true
      },
      {
        id: 6,
        name: '0018',
        active: true
      },
      {
        id: 7,
        name: '0019',
        active: true
      }
    ]);
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('lots');
  }
};
