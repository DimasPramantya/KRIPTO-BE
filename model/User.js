const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const User = sequelize.define('users', {
  id:{
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  username:{
    type: Sequelize.TEXT,
    allowNull: false
  },
  fullName:{
    type: Sequelize.TEXT,
    allowNull: false
  },
  email: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  password:{
    type: Sequelize.TEXT,
    allowNull: false
  }
},{
  timestamps: false
})

module.exports = User;