module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'lots',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        created_At: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_At: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      },
      {
        timestamps: true // Adicione esta opção
      }
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('lots');
  }
};
