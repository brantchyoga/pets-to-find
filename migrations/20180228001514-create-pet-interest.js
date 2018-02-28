'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pet_interests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      petname: {
        type: Sequelize.STRING
      },
      breed: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      contact: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pet_interests');
  }
};