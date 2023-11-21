const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Folder = sequelize.define('folders', {
  id:{
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name:{
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Folder;