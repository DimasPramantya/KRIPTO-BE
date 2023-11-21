const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Directory = sequelize.define('directories', {
  id:{
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
},{
  timestamps: false
})

module.exports = Directory;