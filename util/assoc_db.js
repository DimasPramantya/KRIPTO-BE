const Directory = require("../model/Directory");
const Folder = require("../model/Folder");
const User = require("../model/User");
const sequelize = require("./db");

Directory.hasMany(Folder);
Folder.belongsTo(Directory);

User.hasOne(Directory);
Directory.belongsTo(User);

const association = async()=>{
  try {
    await sequelize.sync({force: false});
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = association;