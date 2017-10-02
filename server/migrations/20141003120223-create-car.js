"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .createTable('Cars', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        address: Sequelize.STRING,
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        vin: Sequelize.STRING,
        spz: Sequelize.STRING,
        brand: Sequelize.STRING,
        model: Sequelize.STRING,
        category: Sequelize.STRING,
        distance: Sequelize.INTEGER,
        dateRegistered: Sequelize.DATE,
        value: Sequelize.INTEGER,
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: Sequelize.DATE
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface
      .dropTable('Cars');
  }
};
