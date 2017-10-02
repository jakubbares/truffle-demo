"use strict";

module.exports = function(sequelize, DataTypes) {
  var Car = sequelize.define("Car", {
    address: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    vin: DataTypes.STRING,
    spz: DataTypes.STRING,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    category: DataTypes.STRING,
    distance: DataTypes.INTEGER,
    dateRegistered: DataTypes.DATE,
    value: DataTypes.INTEGER
  });

  return Car;
};

