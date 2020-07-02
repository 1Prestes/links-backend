module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn('Accounts', 'jwtVersion', {
    type: Sequelize.INTEGER,
    allowNull: false,
    after: 'password',
    defaultValue: 0,
  }),

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn('Accounts', 'jwtVersion'),
};
