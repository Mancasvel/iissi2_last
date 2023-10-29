'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }/*,
      bebida: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: new Date()
      },
      primer_plato: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: new Date()
      },
      segundo_plato: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: new Date()
      },
      postre: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: new Date()
      } */
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductCategories')
  }
}
