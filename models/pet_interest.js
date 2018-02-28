'use strict';
module.exports = (sequelize, DataTypes) => {
  var pet_interest = sequelize.define('pet_interest', {
    userId: DataTypes.INTEGER,
    petname: DataTypes.STRING,
    breed: DataTypes.STRING,
    description: DataTypes.TEXT,
    images: DataTypes.ARRAY(DataTypes.TEXT),
    contact: DataTypes.STRING
  }, {});
  pet_interest.associate = function(models) {
    // associations can be defined here
    models.pet_interest.belongsTo(models.user);
  };
  return pet_interest;
};
